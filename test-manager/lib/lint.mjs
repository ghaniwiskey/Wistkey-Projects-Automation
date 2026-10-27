// Quality rules for test cases, Playwright POM specs, bugs, plans, and project.yaml. Used by the web app.
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { PROJECTS, ROOT, SHARED, rel, projectSlugs, loadProject } from './workspace.mjs';

const PRIORITIES = ['P0', 'P1', 'P2', 'P3'];
const SEVERITIES = ['critical', 'major', 'minor', 'trivial'];
const BUG_STATUSES = ['open', 'fixed', 'verified', 'wont-fix', 'duplicate'];

export function prefixCounts() {
  const prefixes = new Map();
  for (const s of projectSlugs()) {
    try { const pf = YAML.parse(fs.readFileSync(path.join(PROJECTS, s, 'project.yaml'), 'utf8')).testIdPrefix; prefixes.set(pf, (prefixes.get(pf) || 0) + 1); } catch { /* reported by lint */ }
  }
  return prefixes;
}

export function lintSlug(slug) {
  return lintProject(loadProject(slug), prefixCounts());
}

export function lintProject(p, prefixes) {
  const E = [];
  const W = [];
  const at = (f) => rel(f);
  if (p.cfgError || !p.cfg) { E.push(`project.yaml: ${p.cfgError || 'empty'}`); return { E, W }; }
  const c = p.cfg;
  for (const k of ['name', 'slug', 'testIdPrefix', 'defaultEnv', 'envs']) if (!c[k]) E.push(`project.yaml: missing "${k}"`);
  if (c.slug && c.slug !== p.slug) E.push(`project.yaml: slug "${c.slug}" does not match folder "${p.slug}"`);
  if (c.testIdPrefix && !/^[A-Z][A-Z0-9]*$/.test(c.testIdPrefix)) E.push(`project.yaml: testIdPrefix "${c.testIdPrefix}" must be uppercase letters/digits`);
  if (c.testIdPrefix && prefixes.get(c.testIdPrefix) > 1) E.push(`project.yaml: testIdPrefix "${c.testIdPrefix}" is used by another project`);
  if (c.envs && c.defaultEnv && !c.envs[c.defaultEnv]) E.push(`project.yaml: defaultEnv "${c.defaultEnv}" is not defined in envs`);
  for (const [name, env] of Object.entries(c.envs || {})) {
    if (!env?.baseUrl) { E.push(`project.yaml: env "${name}" has no baseUrl`); continue; }
    let u;
    try { u = new URL(env.baseUrl); } catch { E.push(`project.yaml: env "${name}" baseUrl is not a valid URL`); continue; }
    if (typeof env.allowWrites !== 'boolean') W.push(`project.yaml: env "${name}" should set allowWrites: true|false`);
    if (/^(prod|production|live)$/i.test(name) && env.allowWrites) W.push(`project.yaml: env "${name}" allows writes; confirm this is intended`);
    if (u.pathname.length > 1 && !u.pathname.endsWith('/')) W.push(`project.yaml: env "${name}" baseUrl has a sub-path without a trailing slash; relative URLs will resolve outside it`);
  }
  // Playwright specs (POM, see .agents/skills/playwright-e2e): selectors live in page objects, specs read like user journeys.
  const specIds = new Map();
  for (const s of p.specs) {
    for (const id of s.ids) {
      if (specIds.has(id)) E.push(`${at(s.file)}: duplicate spec test ID ${id} (also in ${at(specIds.get(id))})`);
      specIds.set(id, s.file);
    }
    const imports = [...s.src.matchAll(/^\s*import\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/gm)].map((m) => m[1]);
    for (const m of imports.filter((x) => /^\.\.?\/|^@shared\//.test(x))) {
      const base = m.startsWith('@shared/') ? path.join(SHARED, m.slice(8)) : path.resolve(path.dirname(s.file), m);
      const cands = [base, base + '.ts', base + '.js', base.replace(/\.js$/, '.ts'), path.join(base, 'index.ts')];
      if (!cands.some((x) => fs.existsSync(x) && fs.statSync(x).isFile())) E.push(`${at(s.file)}: imports ${m}, which does not exist`);
      // Projects stay independent: share code through shared/ (@shared/...), never by reaching into another project.
      const inProject = !path.relative(p.dir, base).startsWith('..');
      const inShared = !path.relative(SHARED, base).startsWith('..');
      if (!inProject && !inShared) W.push(`${at(s.file)}: imports ${m} from outside projects/${p.slug}; move shared code to shared/ and import it as @shared/...`);
    }
    for (const m of imports.filter((x) => !/^\.\.?\/|^node:|^@shared\//.test(x))) {
      if (!fs.existsSync(path.join(ROOT, 'node_modules', ...m.split('/').slice(0, m.startsWith('@') ? 2 : 1)))) E.push(`${at(s.file)}: imports ${m}, which is not installed (npm install ${m})`);
    }
    const usesPom = imports.some((m) => /\/(pages|fixtures)\//.test(m));
    if (/\btest\(/.test(s.src) && !usesPom) W.push(`${at(s.file)}: does not use page objects (tests/pages) or fixtures (tests/fixtures); keep selectors and actions in page objects`);
    if (/\bpage\.(locator|\$|\$\$)\(/.test(s.src)) W.push(`${at(s.file)}: uses page.locator() directly; move selectors into a page object`);
    if (/\bwaitForTimeout\(/.test(s.src)) W.push(`${at(s.file)}: uses waitForTimeout(); rely on auto-waiting and web-first assertions instead`);
    if (/\b(test|describe)\.only\(/.test(s.src)) E.push(`${at(s.file)}: contains .only(); remove it before committing`);
    if (s.ids.length === 0 && /\btest\(/.test(s.src)) W.push(`${at(s.file)}: no test title starts with a test ID ("${c.testIdPrefix || 'ID'}-001: ..."), so results cannot be linked to test cases`);
  }
  const ids = new Map();
  const prefix = c.testIdPrefix;
  for (const t of p.tests) {
    const f = at(t.file);
    if (t.error) { E.push(`${f}: ${t.error}`); continue; }
    const fm = t.fm;
    for (const k of ['id', 'title', 'feature', 'priority', 'tags']) if (fm[k] === undefined || fm[k] === null || fm[k] === '') E.push(`${f}: missing "${k}"`);
    if (fm.id) {
      if (prefix && !new RegExp(`^${prefix}-\\d{3,}$`).test(fm.id)) E.push(`${f}: id "${fm.id}" should look like ${prefix}-001`);
      if (!path.basename(t.file).startsWith(fm.id + '-') && path.basename(t.file) !== fm.id + '.md') W.push(`${f}: file name should start with "${fm.id}-"`);
      if (ids.has(fm.id)) E.push(`${f}: duplicate id ${fm.id} (also ${ids.get(fm.id)})`);
      ids.set(fm.id, f);
    }
    if (fm.priority && !PRIORITIES.includes(fm.priority)) E.push(`${f}: priority "${fm.priority}" must be one of ${PRIORITIES.join(', ')}`);
    if (fm.tags !== undefined && (!Array.isArray(fm.tags) || !fm.tags.length)) E.push(`${f}: tags must be a non-empty list, e.g. [smoke]`);
    if (typeof fm.automated !== 'boolean') W.push(`${f}: set automated: true|false`);
    if (!/^##\s+Steps\s*$/m.test(t.body) || !/^\s*1\.\s+\S/m.test(t.body)) E.push(`${f}: needs a "## Steps" section with numbered steps`);
    const exp = /^##\s+Expected\s*$([\s\S]*?)(^##\s|(?![\s\S]))/m.exec(t.body);
    if (!exp || !/^\s*[-*]\s+\S/m.test(exp[1])) E.push(`${f}: needs a "## Expected" section with at least one bullet`);
    const autoFile = specIds.get(fm.id);
    if (fm.id && fm.automated === true && !autoFile) E.push(`${f}: automated: true but no Playwright test titled "${fm.id}: ..."`);
    if (fm.id && fm.automated === false && autoFile) W.push(`${f}: automated by ${at(autoFile)}; set automated: true`);
    if (/PREFIX-000|YYYY-MM-DD|\{\{(name|slug|prefix)\}\}/.test(JSON.stringify(fm) + t.body)) W.push(`${f}: template placeholders left in the file`);
  }
  for (const [id, file] of specIds) if (!ids.has(id)) W.push(`${at(file)}: Playwright test ${id} has no matching test case projects/${p.slug}/cases/**/${id}-*.md`);
  const bugIds = new Map();
  for (const b of p.bugs) {
    const f = at(b.file);
    if (b.error) { E.push(`${f}: ${b.error}`); continue; }
    const fm = b.fm;
    if (!fm.id || !/^BUG-\d{3,}$/.test(fm.id)) E.push(`${f}: id must look like BUG-001`);
    if (fm.id && bugIds.has(fm.id)) E.push(`${f}: duplicate bug id ${fm.id}`);
    if (fm.id) bugIds.set(fm.id, f);
    if (!fm.title) E.push(`${f}: missing title`);
    if (!SEVERITIES.includes(fm.severity)) E.push(`${f}: severity must be one of ${SEVERITIES.join(', ')}`);
    if (!BUG_STATUSES.includes(fm.status)) E.push(`${f}: status must be one of ${BUG_STATUSES.join(', ')}`);
    // wont-fix = accepted behavior, duplicate = tracked by another bug: neither keeps tests linked.
    // (fixed/verified keep their tests: list, it is the retest record.)
    if (['wont-fix', 'duplicate'].includes(fm.status) && Array.isArray(fm.tests) && fm.tests.length) {
      W.push(`${f}: ${fm.id} is ${fm.status} but still lists tests [${fm.tests.join(', ')}]; update those cases/specs (wont-fix: accepted behavior; duplicate: link the original bug), then empty tests: (docs/conventions.md > Bugs)`);
    }
  }
  const qIds = new Map();
  for (const x of p.questions || []) {
    const f = at(x.file);
    if (x.error) { E.push(`${f}: ${x.error}`); continue; }
    const fm = x.fm;
    if (!fm.id || !/^Q-\d{3,}$/.test(fm.id)) E.push(`${f}: id must look like Q-001`);
    if (fm.id && qIds.has(fm.id)) E.push(`${f}: duplicate question id ${fm.id}`);
    if (fm.id) qIds.set(fm.id, f);
    if (!fm.title) E.push(`${f}: missing title`);
    if (!['open', 'answered', 'closed'].includes(fm.status)) E.push(`${f}: status must be open, answered or closed`);
    for (const b of fm.bugs || []) if (!bugIds.has(b)) W.push(`${f}: links ${b}, which is not a bug in this project`);
    if (fm.status === 'answered' && /^##\s+Answer\s*\n+Not answered yet\./m.test(x.body)) W.push(`${f}: ${fm.id} is answered but the ## Answer section is empty`);
  }
  // Only an OPEN bug may be expected to fail. fixed/verified: the test must pass now; wont-fix: test the
  // accepted behavior; duplicate: refer to the original bug.
  const closedStatus = new Map(p.bugs.filter((b) => !b.error && b.fm.id && b.fm.status && b.fm.status !== 'open').map((b) => [b.fm.id, b.fm.status]));
  for (const s of p.specs) {
    for (const m of s.src.matchAll(/\btest\.fail\([^)]*?\b(BUG-\d{3,})\b/g)) {
      const st = closedStatus.get(m[1]);
      if (st) E.push(`${at(s.file)}: test.fail() still expects ${m[1]}, which is ${st} (only open bugs may be expected to fail); remove test.fail() (${st === 'wont-fix' ? 'test the accepted behavior' : st === 'duplicate' ? 'refer to the original bug' : 'the test must pass now'}) (docs/conventions.md > Bugs)`);
    }
  }
  for (const t of p.tests) {
    if (t.error) continue;
    for (const m of t.body.matchAll(/\b(BUG-\d{3,})\b[^\n]*\bexpected to fail\b|\bexpected to fail\b[^\n]*\b(BUG-\d{3,})\b/gi)) {
      const id = m[1] || m[2];
      if (closedStatus.has(id)) W.push(`${at(t.file)}: says ${id} is expected to fail, but ${id} is ${closedStatus.get(id)}; update the note (only open bugs are expected to fail)`);
    }
  }
  const planIds = new Set();
  for (const pl of p.plans) {
    const f = at(pl.file);
    if (!/^PLAN-\d{3,}$/.test(pl.id)) E.push(`${f}: id must look like PLAN-001`);
    if (planIds.has(pl.id)) E.push(`${f}: duplicate plan id ${pl.id}`);
    planIds.add(pl.id);
    if (!pl.name) W.push(`${f}: missing name`);
    for (const id of (pl.scope && pl.scope.tests) || []) if (!ids.has(id)) W.push(`${f}: scope test ${id} does not exist`);
  }
  return { E, W };
}
