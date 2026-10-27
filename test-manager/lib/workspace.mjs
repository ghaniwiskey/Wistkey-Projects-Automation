// Shared data loading for the Test Manager: web app, HTML reports, Playwright reporter.
// Layout (one folder per app under test): projects/<slug>/
//   project.yaml                       envs, Playwright settings, suites, accounts
//   tests/{e2e,pages,fixtures,utils}   Playwright POM suite, linked to test cases by the ID at the start of the test title
//   cases/ plans/ bugs/ runs/ archive/ test management data
// shared/ holds helpers used by several projects (import as @shared/...). projects/_template is copied for new projects.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const PROJECTS = path.join(ROOT, 'projects');
export const SHARED = path.join(ROOT, 'shared');
export const REPORTS = path.join(ROOT, 'reports');
export const DEFAULT_SPEC_DIR = 'tests/e2e';
export const ID_IN_SPEC = /\btest(?:\.(?:only|skip|fixme|fail))?\(\s*['"`]([A-Z][A-Z0-9]*-\d+)\b/g;
export const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');
export const pad = (n, w = 2) => String(n).padStart(w, '0');
export const fmtDate = (d = new Date()) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
export const today = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const stamp = (d = new Date()) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;

export function walk(dir, test) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p, test));
    else if (test(e.name)) out.push(p);
  }
  return out.sort();
}

export function readDoc(file) {
  const src = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(src);
  if (!m) return { file, fm: null, body: src, error: 'missing YAML frontmatter' };
  try {
    return { file, fm: YAML.parse(m[1]) || {}, body: m[2] };
  } catch (e) {
    return { file, fm: null, body: m[2], error: 'invalid frontmatter: ' + e.message.split('\n')[0] };
  }
}

// "## Heading" sections of a Markdown body -> { heading-lowercase: text }
export function sections(body) {
  const out = {};
  let key = '_intro';
  for (const line of String(body || '').replace(/\r/g, '').split('\n')) {
    const m = /^##\s+(.+?)\s*$/.exec(line);
    if (m) { key = m[1].toLowerCase(); out[key] = ''; continue; }
    out[key] = (out[key] || '') + line + '\n';
  }
  for (const k of Object.keys(out)) out[k] = out[k].trim();
  return out;
}

export function projectSlugs() {
  if (!fs.existsSync(PROJECTS)) return [];
  return fs.readdirSync(PROJECTS, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('_') && !e.name.startsWith('.') && fs.existsSync(path.join(PROJECTS, e.name, 'project.yaml')))
    .map((e) => e.name)
    .sort();
}

export function readYaml(file) {
  try { return { file, data: YAML.parse(fs.readFileSync(file, 'utf8')) || {} }; } catch (e) { return { file, data: null, error: e.message.split('\n')[0] }; }
}

// Folder with a project's Playwright specs (POM suite): playwright.testDir relative to projects/<slug>/.
export function specDirOf(cfg, slug) {
  const d = (cfg && cfg.playwright && cfg.playwright.testDir) || DEFAULT_SPEC_DIR;
  return path.resolve(PROJECTS, slug, d);
}

// Playwright project names for a project slug (first browser = <slug>, others = <slug>-<browser>), as in playwright.config.ts.
export function playwrightProjectsOf(cfg, slug) {
  const browsers = (cfg && cfg.playwright && Array.isArray(cfg.playwright.browsers) && cfg.playwright.browsers.length) ? cfg.playwright.browsers : ['chromium'];
  return browsers.map((b, i) => (i === 0 ? slug : `${slug}-${b}`));
}

export function loadProject(slug) {
  const dir = path.join(PROJECTS, slug);
  let cfg = null;
  let cfgError = null;
  try { cfg = YAML.parse(fs.readFileSync(path.join(dir, 'project.yaml'), 'utf8')); } catch (e) { cfgError = e.message.split('\n')[0]; }
  const docs = (sub) => walk(path.join(dir, sub), (n) => n.endsWith('.md')).map(readDoc);
  // Playwright specs: a test is linked to a test case when its title starts with the case ID, e.g. test('SCG-001: ...').
  const specs = walk(specDirOf(cfg, slug), (n) => /\.spec\.(m?js|ts)$/.test(n)).map((file) => {
    const src = fs.readFileSync(file, 'utf8');
    return { file, src, kind: 'playwright', ids: [...src.matchAll(ID_IN_SPEC)].map((m) => m[1]) };
  });
  const runs = [];
  const runsDir = path.join(dir, 'runs');
  if (fs.existsSync(runsDir)) {
    for (const r of fs.readdirSync(runsDir)) {
      const f = path.join(runsDir, r, 'results.json');
      if (!fs.existsSync(f)) continue;
      try { runs.push(Object.assign(JSON.parse(fs.readFileSync(f, 'utf8')), { dir: path.join(runsDir, r) })); } catch { /* skip corrupt */ }
    }
  }
  runs.sort((a, b) => String(a.startedAt).localeCompare(String(b.startedAt)));
  const plans = walk(path.join(dir, 'plans'), (n) => /\.ya?ml$/.test(n)).map(readYaml).filter((x) => x.data && x.data.id)
    .map((x) => ({ ...x.data, file: x.file }))
    .sort((a, b) => String(a.id).localeCompare(String(b.id), undefined, { numeric: true }));
  return {
    slug, dir, cfg, cfgError, specDir: specDirOf(cfg, slug), testsDir: path.join(dir, 'tests'), tests: docs('cases'), archived: docs(path.join('archive', 'cases')), bugs: docs('bugs'), questions: docs('questions'),
    specs, runs, plans,
  };
}

// Test IDs covered by automation (Playwright specs).
export const specIdsOf = (p) => new Set(p.specs.flatMap((s) => s.ids));
export const automatedIdsOf = specIdsOf;

// Exploratory and baseline runs hold pseudo-tests (EXP-1, BASE-1); manual runs can be in progress.
// Neither counts toward pass rates, flakiness, or "last result".
export const isPseudoRun = (r) => /^(explore|baseline)/.test(String(r.suite || ''));
export const isStatsRun = (r) => !isPseudoRun(r) && !r.inProgress;

export function testStats(p) {
  const last = new Map();
  const history = new Map();
  for (const r of p.runs.filter(isStatsRun)) {
    for (const t of r.tests || []) {
      if (t.status === 'untested') continue;
      last.set(t.id, { status: t.status, at: r.startedAt, run: r.runId, runner: r.runner });
      if (!history.has(t.id)) history.set(t.id, []);
      history.get(t.id).push(t.status);
    }
  }
  return { last, history };
}

// ---------------------------------------------------------------- test plans
export function planScope(plan, tests) {
  const tags = new Set((plan.scope && plan.scope.tags) || []);
  const extra = new Set((plan.scope && plan.scope.tests) || []);
  const exclude = new Set((plan.scope && plan.scope.exclude) || []);
  return tests.filter((t) => t.fm && t.fm.id && !exclude.has(t.fm.id) && (extra.has(t.fm.id) || (t.fm.tags || []).some((x) => tags.has(x))))
    .map((t) => t.fm.id);
}

export function planProgress(plan, p) {
  const ids = planScope(plan, p.tests);
  const runs = p.runs.filter((r) => r.plan === plan.id);
  const latest = new Map();
  for (const r of runs) {
    for (const t of r.tests || []) {
      if (!ids.includes(t.id) || t.status === 'untested') continue;
      latest.set(t.id, { status: t.status, runId: r.runId, runner: r.runner, at: r.startedAt, bug: t.bug });
    }
  }
  const c = { total: ids.length, pass: 0, fail: 0, flaky: 0, blocked: 0, skipped: 0, untested: 0 };
  for (const id of ids) {
    const l = latest.get(id);
    if (!l) c.untested++;
    else c[l.status] = (c[l.status] || 0) + 1;
  }
  c.executed = c.total - c.untested - c.skipped;
  const bugIds = new Set();
  for (const b of p.bugs) {
    if (!b.fm || !['open', 'fixed'].includes(b.fm.status)) continue;
    if ((b.fm.tests || []).some((x) => ids.includes(x))) bugIds.add(b.fm.id);
  }
  for (const l of latest.values()) if (l.bug && l.status === 'fail') bugIds.add(l.bug);
  const ready = c.total > 0 && c.untested === 0 && c.fail === 0 && c.blocked === 0;
  return { ids, counts: c, latest: Object.fromEntries(latest), runs: runs.map((r) => r.runId), bugs: [...bugIds], ready };
}
