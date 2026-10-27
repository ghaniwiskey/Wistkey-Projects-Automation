import { latestIssueDate } from '../public/js/issue-sort.js';
// Data access for the Test Manager web app. Test management data lives in plain files:
// projects/<slug>/{project.yaml,cases,plans,bugs,runs,archive}. Automation is the project's Playwright POM suite
// (projects/<slug>/tests/e2e/**/*.spec.ts + tests/pages), linked to a test case by the ID at the start of the test title.
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import {
  ROOT, PROJECTS, loadProject, projectSlugs, playwrightProjectsOf, rel, today, stamp, isPseudoRun, planScope,
} from './workspace.mjs';
import { buildModel, md } from './html-report.mjs';
import { lintProject, prefixCounts } from './lint.mjs';
import { buildRunReport } from './run-report.mjs';
import { summarize as summarizeRun, renderReport } from './report-md.mjs';

export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
const fail = (status, msg) => { throw new HttpError(status, msg); };
const bad = (msg) => fail(400, msg);
const notFound = (what) => fail(404, `${what} not found`);

const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;
const PRIORITIES = ['P0', 'P1', 'P2', 'P3'];
const SEVERITIES = ['critical', 'major', 'minor', 'trivial'];
const BUG_STATUSES = ['open', 'fixed', 'verified', 'wont-fix', 'duplicate'];
const QUESTION_STATUSES = ['open', 'answered', 'closed'];
const RESULT_STATUSES = ['pass', 'fail', 'blocked', 'skipped', 'untested'];
const FAILURE_TYPES = ['product-bug', 'test-issue', 'environment', 'untriaged'];
const PLAN_STATUSES = ['draft', 'active', 'done'];
const SIGNOFF = ['pending', 'approved', 'rejected'];

const slugify = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48);
const clean = (s) => String(s ?? '').replace(/\r/g, '').trim();
// File-name slug cut at a word boundary: "delete-a-todo-item-with-the-remove" instead of "...remove-butto".
const shortSlug = (s, n = 40) => {
  const x = slugify(s);
  if (x.length <= n) return x;
  const cut = x.slice(0, n);
  const i = cut.lastIndexOf('-');
  return i > 10 ? cut.slice(0, i) : cut;
};
const cleanList = (v) => (Array.isArray(v) ? v : String(v || '').split('\n'))
  .map((x) => clean(x).replace(/^(?:[-*]|\d+[.)])\s+(?:\[[ xX]\]\s+)?/, '')).filter(Boolean);
const cleanTags = (v) => [...new Set((Array.isArray(v) ? v : String(v || '').split(/[,\n]/)).map((x) => clean(x).replace(/\s+/g, '-')).filter(Boolean))];
const writeJson = (file, obj) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(obj, null, 2)); };
const q = (s) => JSON.stringify(String(s ?? ''));
const flow = (a) => `[${(a || []).map((x) => (/^[A-Za-z0-9_.:@/-]+$/.test(String(x)) ? x : q(x))).join(', ')}]`;
const nowIso = () => new Date().toISOString();

// ---------------------------------------------------------------- cache
const cache = new Map();
export function invalidate(slug) {
  if (slug) cache.delete(slug);
  else cache.clear();
}
function project(slug) {
  if (!SLUG_RE.test(String(slug || '')) || !fs.existsSync(path.join(PROJECTS, slug, 'project.yaml'))) notFound(`Project "${slug}"`);
  let c = cache.get(slug);
  if (!c) {
    const p = loadProject(slug);
    c = { p, m: buildModel(p) };
    cache.set(slug, c);
  }
  return c;
}

// ---------------------------------------------------------------- shared shapes
function summarize(tests) {
  const s = { total: tests.length, pass: 0, fail: 0, flaky: 0, blocked: 0, skipped: 0, untested: 0 };
  for (const t of tests) s[t.status] = (s[t.status] || 0) + 1;
  return s;
}
function verdictOf(s, inProgress) {
  if (inProgress) return 'in-progress';
  if (!s || !s.total) return 'empty';
  if (s.fail) return 'fail';
  if (s.blocked) return 'blocked';
  if (s.flaky) return 'flaky';
  if (s.pass) return 'pass';
  return 'skipped';
}
const fileUrl = (dir, relPath) => '/files/' + rel(path.join(dir, relPath)).split('/').map(encodeURIComponent).join('/');
const isImage = (p) => /\.(png|jpe?g|webp|gif)$/i.test(p);

function runSummary(r) {
  const tests = r.tests || [];
  const s = summarize(tests);
  const checks = tests.flatMap((t) => t.checks || []);
  return {
    runId: r.runId, runner: r.runner, suite: r.suite, env: r.env, plan: r.plan || null, request: r.request || null, baseUrl: r.baseUrl,
    startedAt: r.startedAt, finishedAt: r.finishedAt || null, durationMs: r.finishedAt && r.startedAt ? new Date(r.finishedAt) - new Date(r.startedAt) : null,
    inProgress: !!r.inProgress, pseudo: isPseudoRun(r), summary: s, verdict: verdictOf(s, r.inProgress),
    checks: { pass: checks.filter((c) => c.pass).length, total: checks.length }, notes: r.notes || '',
  };
}

// Insight HTML from the report model links to report anchors; point them at app routes instead.
function appLinks(html) {
  return String(html).replace(/href="#(tc|run|rt|bugs|bug|runs|tests|plans)--([^"]+)"/g, (m, kind, rest) => {
    const parts = rest.split('--');
    const slug = parts[0];
    if (kind === 'tc') return `href="#/p/${slug}/tests/${parts[1]}"`;
    if (kind === 'run' || kind === 'runs') return `href="#/p/${slug}/runs${parts[1] ? '/' + parts[1] : ''}"`;
    if (kind === 'rt') return `href="#/p/${slug}/runs/${parts[1]}?test=${parts[2]}"`;
    if (kind === 'bug') return `href="#/p/${slug}/bugs/${parts[1]}"`;
    return `href="#/p/${slug}/${kind}"`;
  });
}

const envList = (cfg) => Object.entries(cfg.envs || {}).map(([name, e]) => ({
  name, baseUrl: e.baseUrl, allowWrites: !!e.allowWrites, isDefault: name === cfg.defaultEnv, startCommand: e.startCommand || null,
}));

// ---------------------------------------------------------------- projects
function projectSummary(slug) {
  const { p, m } = project(slug);
  return {
    slug, name: m.name, description: m.cfg.description || '', prefix: m.cfg.testIdPrefix || '', defaultEnv: m.cfg.defaultEnv, envs: envList(m.cfg),
    tests: m.tests.length, automated: m.automated, passRate: m.passRate, failing: m.failing.map((t) => t.id), flaky: m.flaky.map((t) => t.id),
    neverRun: m.never.length, openBugs: m.openBugs.length, openQuestions: p.questions.filter((x) => x.fm && x.fm.id && (x.fm.status || 'open') === 'open').length, runs: p.runs.length, lastRun: m.lastRun ? runSummary(m.lastRun) : null,
    activePlans: m.plans.filter((pl) => pl.status === 'active').map((pl) => ({ id: pl.id, name: pl.name, counts: pl.progress.counts, ready: pl.progress.ready })),
    inProgressRuns: p.runs.filter((r) => r.inProgress).map((r) => r.runId),
    folder: rel(p.dir), specDir: rel(p.specDir), pagesDir: rel(path.join(p.testsDir, 'pages')), specFiles: p.specs.length,
    playwrightProjects: playwrightProjectsOf(m.cfg, slug),
  };
}

export function listProjects() {
  return projectSlugs().map((slug) => {
    try { return projectSummary(slug); } catch (e) { return { slug, name: slug, error: e.message }; }
  });
}

export function recentRuns(limit = 12) {
  const all = [];
  for (const slug of projectSlugs()) {
    try {
      const { p, m } = project(slug);
      for (const r of p.runs.slice(-limit)) all.push({ ...runSummary(r), project: slug, projectName: m.name });
    } catch { /* skip broken project */ }
  }
  return all.sort((a, b) => String(b.startedAt).localeCompare(String(a.startedAt))).slice(0, limit);
}

// Test accounts from project.yaml: `auth.accounts` (list, each with roles), or the legacy `auth.roles`
// map (role -> account), whose entries sharing a username are merged into one account with several roles.
export function accountsOf(cfg) {
  const auth = (cfg && cfg.auth) || {};
  const norm = (a, roles) => ({
    username: String(a.username || '').trim(), roles, passwordless: !!a.passwordless, vaultItem: a.vaultItem || '',
    notes: a.notes || '', envUser: a.envUser || '', envPass: a.envPass || '',
  });
  if (Array.isArray(auth.accounts)) {
    return auth.accounts.filter((a) => a && typeof a === 'object').map((a) => norm(a, (Array.isArray(a.roles) ? a.roles : a.roles ? [a.roles] : []).map(String)));
  }
  const out = [];
  for (const [role, a] of Object.entries(auth.roles || {})) {
    const r = a && typeof a === 'object' ? a : {};
    const same = r.username && out.find((x) => x.username.toLowerCase() === String(r.username).toLowerCase());
    if (same) same.roles.push(role);
    else out.push(norm(r, [role]));
  }
  return out;
}

export function getProject(slug) {  const { p, m } = project(slug);
  const lint = lintProject(p, prefixCounts());
  const features = {};
  const tags = {};
  for (const t of m.tests) {
    features[t.feature || 'general'] = (features[t.feature || 'general'] || 0) + 1;
    for (const x of t.tags || []) tags[x] = (tags[x] || 0) + 1;
  }
  return {
    ...projectSummary(slug),
    config: m.cfg,
    accounts: accountsOf(m.cfg),
    suites: Object.entries(m.cfg.suites || {}).map(([name, s]) => ({
      name, tags: s.tags || [], description: s.description || '',
      count: m.tests.filter((t) => (t.tags || []).some((x) => (s.tags || []).includes(x))).length,
    })),
    features, tags,
    insights: m.insights.map((i) => ({ level: i.level, html: appLinks(i.html) })),
    history: m.testRuns.slice(-20).map(runSummary),
    recentRuns: p.runs.slice(-8).reverse().map(runSummary),
    plans: m.plans.map(planSummary),
    lint: { errors: lint.E, warnings: lint.W },
    a11y: m.a11yList.slice(0, 20).map((v) => ({ id: v.id, impact: v.impact, count: v.count, help: v.help, helpUrl: v.helpUrl, url: v.url, runId: v.run.runId })),
    perf: m.perfList.map((x) => ({ url: x.url, ttfbMs: x.ttfbMs, loadMs: x.loadMs, lcpMs: x.lcpMs, cls: x.cls, resources: x.resources, runId: x.run.runId })),
  };
}

export function createProject(d) {
  const slug = clean(d.slug).toLowerCase();
  if (!SLUG_RE.test(slug)) bad('Slug must use lowercase letters, digits and hyphens, for example "shop" or "admin-portal".');
  if (fs.existsSync(path.join(PROJECTS, slug))) bad(`A project called "${slug}" already exists.`);
  const url = clean(d.url);
  try { new URL(url); } catch { bad('Base URL must be a full URL, for example https://staging.example.com/'); }
  const env = slugify(d.env) || (/localhost|127\.0\.0\.1/.test(url) ? 'local' : 'staging');
  const parts = slug.split('-').filter(Boolean);
  let prefix = (clean(d.prefix) || (parts.length > 1 ? parts.map((x) => x[0]).join('') : slug.replace(/[^a-z0-9]/g, '').slice(0, 6))).toUpperCase();
  if (!/^[A-Z][A-Z0-9]*$/.test(prefix)) bad('Test ID prefix must be letters and digits, starting with a letter.');
  const used = prefixCounts();
  if (used.has(prefix)) { let i = 2; while (used.has(prefix + i)) i++; prefix += i; }
  const allowWrites = d.readOnly ? false : !/^(prod|production|live)$/i.test(env);
  const name = clean(d.name) || slug.split('-').map((x) => x[0].toUpperCase() + x.slice(1)).join(' ');
  // Copy projects/_template: project.yaml, a POM skeleton (tests/e2e, pages, fixtures, utils) with a working
  // <PREFIX>-001 home page smoke test, its test case, and empty plans/bugs/runs folders.
  const template = path.join(PROJECTS, '_template');
  if (!fs.existsSync(path.join(template, 'project.yaml'))) bad('projects/_template is missing; restore it from git.');
  const dest = path.join(PROJECTS, slug);
  fs.cpSync(template, dest, { recursive: true });
  const vars = { name: /[:#{}[\],&*?|<>=!%@`'"]/.test(name) ? q(name) : name, slug, prefix, env, baseUrl: url, allowWrites: String(allowWrites), today: today() };
  const walkAll = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walkAll(path.join(dir, e.name)) : [path.join(dir, e.name)]));
  for (const f of walkAll(dest)) {
    if (/\.(md|ya?ml|ts|js)$/.test(f)) fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace(/\{\{(name|slug|prefix|env|baseUrl|allowWrites|today)\}\}/g, (m, k) => vars[k]));
    const base = path.basename(f);
    if (base.startsWith('PREFIX-')) fs.renameSync(f, path.join(path.dirname(f), prefix + base.slice('PREFIX'.length)));
  }
  if (clean(d.description)) updateProjectConfig(slug, { description: d.description });
  invalidate(slug);
  return { slug, prefix, env, allowWrites };
}

export function updateProjectConfig(slug, patch) {
  project(slug);
  const file = path.join(PROJECTS, slug, 'project.yaml');
  const doc = YAML.parseDocument(fs.readFileSync(file, 'utf8'));
  if (patch.name !== undefined) { if (!clean(patch.name)) bad('Name is required'); doc.set('name', clean(patch.name)); }
  if (patch.description !== undefined) doc.set('description', clean(patch.description));
  if (Array.isArray(patch.envs)) {
    if (!patch.envs.length) bad('Keep at least one environment');
    const names = new Set();
    for (const e of patch.envs) {
      const name = slugify(e.name);
      if (!name) bad('Every environment needs a name');
      try { new URL(clean(e.baseUrl)); } catch { bad(`Environment "${name}" needs a full base URL`); }
      names.add(name);
      doc.setIn(['envs', name, 'baseUrl'], clean(e.baseUrl));
      doc.setIn(['envs', name, 'allowWrites'], !!e.allowWrites);
    }
    const existing = doc.get('envs');
    if (existing && existing.items) for (const item of [...existing.items]) if (!names.has(String(item.key.value ?? item.key))) doc.deleteIn(['envs', item.key.value ?? item.key]);
  }
  if (patch.defaultEnv !== undefined) doc.set('defaultEnv', slugify(patch.defaultEnv));
  if (Array.isArray(patch.accounts)) {
    // Test accounts (auth.accounts): one entry per login, each with one or more roles.
    // Usernames and Vault item names only: passwords never go in the workspace.
    const prefix = String(doc.get('testIdPrefix') || 'QA').toUpperCase();
    const prev = accountsOf(doc.toJS());
    const users = new Set();
    const envNames = new Set();
    const out = patch.accounts.map((a) => {
      // The username may live only in .env (envUser), so the workspace holds no account data at all.
      const username = clean(a.username);
      const envUserIn = clean(a.envUser);
      if (!username && !envUserIn) bad('Every account needs a username or an .env variable for it');
      const key = (username || `env:${envUserIn}`).toLowerCase();
      if (users.has(key)) bad(`Account "${username || envUserIn}" is listed twice`);
      users.add(key);
      const label = username || `.env ${envUserIn}`;
      const roles = [...new Set((Array.isArray(a.roles) ? a.roles : String(a.roles || '').split(',')).map(slugify).filter(Boolean))];
      if (!roles.length) bad(`Account "${label}" needs at least one role, for example "standard-user" or "approver"`);
      // .env names follow <PREFIX>_<ROLE>_USER/PASS from the first role ("standard-user" -> SPF_STANDARD_USER); keep names already set.
      const old = prev.find((x) => (username ? x.username.toLowerCase() === username.toLowerCase() : x.envUser === envUserIn));
      let base = `${prefix}_${roles[0].replace(/-user$/, '').replace(/-/g, '_').toUpperCase()}`;
      for (let i = 2; envNames.has(`${base}_USER`); i++) base = `${prefix}_${roles[0].replace(/-user$/, '').replace(/-/g, '_').toUpperCase()}${i}`;
      const envUser = (old && old.envUser) || envUserIn || `${base}_USER`;
      envNames.add(envUser);
      const acc = username ? { username, roles } : { roles };
      if (a.passwordless) acc.passwordless = true;
      else if (clean(a.vaultItem)) acc.vaultItem = clean(a.vaultItem);
      if (clean(a.notes)) acc.notes = clean(a.notes);
      acc.envUser = envUser;
      if (!a.passwordless || clean(a.envPass)) acc.envPass = (old && old.envPass) || clean(a.envPass) || `${base}_PASS`;
      return acc;
    });
    const current = (doc.toJS().auth || {}).accounts;
    const unchanged = Array.isArray(current) && JSON.stringify(current) === JSON.stringify(out);
    if (!unchanged) { // leave the list (and its comments) alone when nothing changed
    if (!doc.get('auth')) doc.set('auth', doc.createNode({}));
    const node = doc.createNode(out);
    for (const item of node.items) { const r = item.get('roles', true); if (r) r.flow = true; }
    doc.setIn(['auth', 'accounts'], node);
    if (doc.hasIn(['auth', 'roles'])) doc.deleteIn(['auth', 'roles']); // legacy role -> account map, now converted
    }
  }  const envs = doc.toJS().envs || {};
  if (!envs[doc.get('defaultEnv')]) bad('Default environment must be one of the environments');
  // lineWidth 0 keeps one-line maps like `smoke: { tags: [...], description: ... }` on one line.
  fs.writeFileSync(file, doc.toString({ lineWidth: 0, flowCollectionPadding: false }));
  invalidate(slug);
  return getProject(slug);
}

export function projectLint(slug) {
  const { p } = project(slug);
  const r = lintProject(p, prefixCounts());
  return { errors: r.E, warnings: r.W };
}

// ---------------------------------------------------------------- test cases
function splitSections(body) {
  const out = [];
  let cur = { heading: null, lines: [] };
  for (const line of String(body || '').replace(/\r/g, '').split('\n')) {
    const m = /^##\s+(.+?)\s*$/.exec(line);
    if (m) { out.push(cur); cur = { heading: m[1], lines: [] }; continue; }
    cur.lines.push(line);
  }
  out.push(cur);
  return out.filter((s) => s.heading).map((s) => ({ heading: s.heading, key: s.heading.toLowerCase(), text: s.lines.join('\n').trim() }));
}

export function parseTestBody(body) {
  const secs = splitSections(body);
  const get = (k) => (secs.find((s) => s.key === k) || {}).text || '';
  const items = (txt) => String(txt || '').split('\n').map((l) => l.trim()).filter(Boolean).map((l) => l.replace(/^(?:[-*]|\d+[.)])\s+(?:\[[ xX]\]\s+)?/, ''));
  const known = ['goal', 'preconditions', 'data', 'steps', 'expected', 'notes'];
  return {
    goal: get('goal'), preconditions: items(get('preconditions')), data: items(get('data')), steps: items(get('steps')), expected: items(get('expected')),
    notes: get('notes'), extraSections: secs.filter((s) => !known.includes(s.key) && s.text).map((s) => ({ heading: s.heading, text: s.text })),
  };
}

export function testMarkdown(t) {
  const L = ['---', `id: ${t.id}`, `title: ${q(t.title)}`, `feature: ${/^[a-z0-9-]+$/.test(t.feature) ? t.feature : q(t.feature)}`, `priority: ${t.priority}`,
    `tags: ${flow(t.tags)}`, `envs: ${flow(t.envs && t.envs.length ? t.envs : ['all'])}`, `automated: ${!!t.automated}`,
    `created: ${t.created}`, `updated: ${t.updated}`, '---', ''];
  const sec = (h, lines) => { if (lines && lines.length) L.push(`## ${h}`, ...lines, ''); };
  sec('Goal', t.goal ? [t.goal] : []);
  sec('Preconditions', t.preconditions.map((x) => `- ${x}`));
  sec('Data', t.data.map((x) => `- ${x}`));
  sec('Steps', t.steps.map((x, i) => `${i + 1}. ${x}`));
  sec('Expected', t.expected.map((x) => `- ${x}`));
  sec('Notes', t.notes ? [t.notes] : []);
  for (const e of t.extraSections || []) sec(e.heading, [e.text]);
  return L.join('\n').replace(/\n+$/, '\n');
}

function validateTest(d) {
  const title = clean(d.title);
  if (!title) bad('Title is required.');
  if (!PRIORITIES.includes(d.priority)) bad('Priority must be P0, P1, P2 or P3.');
  const tags = cleanTags(d.tags).map((x) => x.toLowerCase());
  if (!tags.length) bad('Add at least one tag, for example smoke or regression.');
  const steps = cleanList(d.steps);
  if (!steps.length) bad('Add at least one step.');
  const expected = cleanList(d.expected);
  if (!expected.length) bad('Add at least one expected result.');
  return {
    title, feature: slugify(d.feature) || 'general', priority: d.priority, tags, envs: cleanTags(d.envs).length ? cleanTags(d.envs) : ['all'],
    goal: clean(d.goal), preconditions: cleanList(d.preconditions), data: cleanList(d.data), steps, expected,
    notes: clean(d.notes), extraSections: Array.isArray(d.extraSections) ? d.extraSections.filter((e) => e && e.heading && e.text) : [],
  };
}

function nextId(ids, prefix) {
  const re = new RegExp(`^${prefix}-(\\d+)$`);
  const max = ids.reduce((mx, id) => { const x = re.exec(id || ''); return x ? Math.max(mx, Number(x[1])) : mx; }, 0);
  return `${prefix}-${String(max + 1).padStart(3, '0')}`;
}
const idOfDoc = (d) => (d.fm && d.fm.id) || path.basename(d.file).split('-').slice(0, 2).join('-');

function testRow(t) {
  return {
    id: t.id, title: t.title, feature: t.feature || 'general', priority: t.priority || '', tags: t.tags || [], automated: !!t.spec, spec: t.spec, file: t.file,
    lastStatus: t.lastStatus, last: t.last ? { runId: t.last.run.runId, runner: t.last.run.runner, at: t.last.run.startedAt, durationMs: t.last.t.durationMs } : null,
    history: t.history.slice(-10).map((x) => ({ runId: x.run.runId, status: x.t.status, runner: x.run.runner })),
    flaky: t.flaky, bugs: t.bugs, updated: String(t.updated || t.created || ''),
  };
}

export function listTests(slug) {
  return project(slug).m.tests.map(testRow);
}

function specBlock(p, id, list = p.specs) {
  for (const s of list) {
    const lines = s.src.split('\n');
    const start = lines.findIndex((l) => new RegExp(`\\btest(?:\\.\\w+)?\\(\\s*['"\`]${id}\\b`).test(l));
    if (start < 0) continue;
    let depth = 0;
    let seen = false;
    for (let i = start; i < lines.length; i++) {
      for (const ch of lines[i]) { if (ch === '{') { depth++; seen = true; } else if (ch === '}') depth--; }
      if (seen && depth <= 0) return { file: rel(s.file), line: start + 1, code: lines.slice(start, i + 1).join('\n') };
    }
    return { file: rel(s.file), line: start + 1, code: lines.slice(start, start + 40).join('\n') };
  }
  return null;
}

export function getTest(slug, id) {
  const { p, m } = project(slug);
  const t = m.tests.find((x) => x.id === id) || notFound(`Test ${id}`);
  const doc = p.tests.find((d) => d.fm && d.fm.id === id);
  const parsed = parseTestBody(doc.body);
  return {
    ...testRow(t), envs: t.envs || ['all'], created: String(t.created || ''), ...parsed,
    history: t.history.slice().reverse().map((x) => ({
      runId: x.run.runId, runner: x.run.runner, at: x.run.startedAt, status: x.t.status, durationMs: x.t.durationMs,
      checks: { pass: (x.t.checks || []).filter((c) => c.pass).length, total: (x.t.checks || []).length },
      failed: (x.t.checks || []).filter((c) => !c.pass).map((c) => c.label), error: x.t.error || null,
    })),
    latestChecks: t.last ? t.last.t.checks || [] : [],
    stepTree: stepItems(parsed.steps),
    specCode: t.spec ? specBlock(p, id) : null,
    plans: m.plans.filter((pl) => pl.progress.ids.includes(id)).map((pl) => ({ id: pl.id, name: pl.name, status: pl.status })),
    raw: fs.readFileSync(doc.file, 'utf8'),
  };
}

export function createTest(slug, data) {
  const { p } = project(slug);
  if (!p.cfg || !p.cfg.testIdPrefix) bad('project.yaml has no testIdPrefix');
  const v = validateTest(data);
  const id = nextId([...p.tests.map(idOfDoc), ...p.archived.map(idOfDoc), ...p.specs.flatMap((s) => s.ids)], p.cfg.testIdPrefix);
  const t = { id, ...v, automated: false, created: today(), updated: today() };
  const file = path.join(p.dir, 'cases', v.feature, `${id}-${shortSlug(v.title) || 'test'}.md`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, testMarkdown(t));
  invalidate(slug);
  return { id, file: rel(file) };
}

export function updateTest(slug, id, data) {
  const { p } = project(slug);
  const doc = p.tests.find((d) => d.fm && d.fm.id === id) || notFound(`Test ${id}`);
  const v = validateTest(data);
  const hasSpec = p.specs.some((s) => s.ids.includes(id));
  const t = { id, ...v, automated: hasSpec, created: String(doc.fm.created || today()), updated: today() };
  let file = doc.file;
  if (v.feature !== (doc.fm.feature || 'general')) {
    file = path.join(p.dir, 'cases', v.feature, path.basename(doc.file));
    fs.mkdirSync(path.dirname(file), { recursive: true });
  }
  fs.writeFileSync(file, testMarkdown(t));
  if (file !== doc.file) fs.rmSync(doc.file);
  invalidate(slug);
  return { id, file: rel(file) };
}

export function archiveTest(slug, id) {
  const { p } = project(slug);
  const doc = p.tests.find((d) => d.fm && d.fm.id === id) || notFound(`Test ${id}`);
  const dest = path.join(p.dir, 'archive', 'cases', path.relative(path.join(p.dir, 'cases'), doc.file));
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.renameSync(doc.file, dest);
  invalidate(slug);
  return { id, archivedTo: rel(dest) };
}

// ---------------------------------------------------------------- steps
// Test case steps as a tree (plain steps; page objects in tests/pages hold the reusable parts for automation).
const stepItems = (steps) => (steps || []).map((text) => ({ kind: 'step', text }));

// Manual-run copy of a step tree, with a result slot per step.
function toRunSteps(tree) {
  return tree.map((it) => ({ kind: 'step', text: it.text, status: null }));
}

// Copy statuses sent by the client onto the stored steps.
function applyStatuses(server, client) {
  return (server || []).map((s, i) => {
    const c = (client || [])[i];
    return { ...s, kind: 'step', status: stepStatus(c && typeof c === 'object' ? c.status : c) };
  });
}

// ---------------------------------------------------------------- runs
export function listRuns(slug) {
  return project(slug).p.runs.slice().reverse().map(runSummary);
}

function findRun(slug, runId) {
  const { p } = project(slug);
  return p.runs.find((r) => r.runId === runId) || notFound(`Run ${runId}`);
}

export function getRun(slug, runId) {
  const { m } = project(slug);
  const r = findRun(slug, runId);
  const known = new Set(m.tests.map((t) => t.id));
  const ev = (list) => (list || []).map((e) => ({ path: e, url: fileUrl(r.dir, e), image: isImage(e) }));
  return {
    ...runSummary(r), workers: r.workers || [], folder: rel(r.dir),
    tests: (r.tests || []).map((t) => ({ ...t, known: known.has(t.id), evidence: ev(t.evidence), history: (t.history || []).map((h) => ({ ...h, evidence: ev(h.evidence) })) })),
  };
}

// Triage a result in any finished run: failure type, linked bug, note. Re-renders report.md.
export function triageRunTest(slug, runId, id, d) {
  const { dir, file, results } = loadRunFile(slug, runId);
  if (results.inProgress) bad('This manual run is still in progress; update the test from the execution screen.');
  const t = (results.tests || []).find((x) => x.id === id) || notFound(`Test ${id} in run`);
  if (d.failureType !== undefined) {
    if (d.failureType && !FAILURE_TYPES.includes(d.failureType)) bad('Unknown failure type');
    if (d.failureType) t.failureType = d.failureType; else delete t.failureType;
  }
  if (d.bug !== undefined) { if (clean(d.bug)) t.bug = clean(d.bug); else delete t.bug; }
  if (clean(d.note)) t.notes = [...(t.notes || []), clean(d.note)];
  writeJson(file, results);
  fs.writeFileSync(path.join(dir, 'report.md'), renderReport(results));
  invalidate(slug);
  runReport(slug, runId);
  return t;
}

// Rebuild a run's HTML test report; never let a report problem break the action that triggered it.
export function runReport(slug, runId, force = true) {
  try { return buildRunReport(slug, runId, { force }); } catch (e) { console.warn(`Run report for ${runId} not built: ${e.message}`); return null; }
}

export function deleteRun(slug, runId) {
  const r = findRun(slug, runId);
  fs.rmSync(r.dir, { recursive: true, force: true });
  invalidate(slug);
  return { deleted: runId };
}

// ---------------------------------------------------------------- manual runs
export function createManualRun(slug, d) {
  const { p, m } = project(slug);
  const env = d.env || m.cfg.defaultEnv;
  const envCfg = (m.cfg.envs || {})[env] || bad(`Unknown environment "${env}"`);
  let ids = cleanTags(d.ids);
  if (!ids.length && d.plan) {
    const pl = p.plans.find((x) => x.id === d.plan) || notFound(`Plan ${d.plan}`);
    ids = planScope(pl, p.tests);
  }
  if (!ids.length) bad('Select at least one test case.');
  const tests = ids.map((id) => {
    const doc = p.tests.find((x) => x.fm && x.fm.id === id) || bad(`Unknown test ${id}`);
    const b = parseTestBody(doc.body);
    const tree = toRunSteps(stepItems(b.steps));
    return {
      id, title: doc.fm.title, priority: doc.fm.priority, feature: doc.fm.feature, file: rel(doc.file), status: 'untested', source: 'manual',
      goal: b.goal, preconditions: b.preconditions, data: b.data, steps: tree,
      expected: b.expected.map((text) => ({ text, status: null })), checks: [], notes: [], evidence: [], durationMs: 0,
    };
  });
  const base = `${stamp()}_${slugify(env)}_manual${d.plan ? '-' + slugify(d.plan) : ''}`;
  let runId = base;
  for (let i = 2; fs.existsSync(path.join(p.dir, 'runs', runId)); i++) runId = `${base}-${i}`;
  const dir = path.join(p.dir, 'runs', runId);
  fs.mkdirSync(path.join(dir, 'screenshots'), { recursive: true });
  writeJson(path.join(dir, 'results.json'), {
    schema: 1, runner: 'manual', project: slug, env, suite: clean(d.name) ? slugify(d.name) : d.plan ? d.plan.toLowerCase() : 'manual', baseUrl: envCfg.baseUrl,
    runId, startedAt: nowIso(), inProgress: true, ...(d.plan ? { plan: d.plan } : {}), tester: clean(d.tester) || undefined, tests, notes: '',
  });
  invalidate(slug);
  return { runId };
}

function loadRunFile(slug, runId) {
  const r = findRun(slug, runId);
  const file = path.join(r.dir, 'results.json');
  return { dir: r.dir, file, results: JSON.parse(fs.readFileSync(file, 'utf8')) };
}
const stepStatus = (s) => (['pass', 'fail', 'skipped'].includes(s) ? s : null);

export function updateManualTest(slug, runId, id, patch) {
  const { file, results } = loadRunFile(slug, runId);
  if (results.runner !== 'manual') bad('Only manual runs can be edited');
  if (!results.inProgress) bad('This run is finished. Start a new manual run to retest.');
  const t = results.tests.find((x) => x.id === id) || notFound(`Test ${id} in run`);
  if (Array.isArray(patch.steps)) t.steps = applyStatuses(t.steps, patch.steps);
  if (Array.isArray(patch.expected)) t.expected = t.expected.map((s, i) => ({ ...s, status: stepStatus(patch.expected[i]) }));
  if (patch.note !== undefined) t.notes = clean(patch.note) ? [clean(patch.note)] : [];
  if (patch.status !== undefined) {
    if (!RESULT_STATUSES.includes(patch.status)) bad('Unknown status');
    t.status = patch.status;
    t.executedAt = nowIso();
  }
  if (patch.failureType !== undefined) t.failureType = FAILURE_TYPES.includes(patch.failureType) ? patch.failureType : undefined;
  if (patch.bug !== undefined) t.bug = clean(patch.bug) || undefined;
  if (Number.isFinite(patch.addDurationMs)) t.durationMs = (t.durationMs || 0) + Math.max(0, Math.min(patch.addDurationMs, 4 * 3600e3));
  const stepChecks = (t.steps || []).map((s, i) => (s.status === 'fail' ? { label: `Step ${i + 1}: ${s.text}`, pass: false } : null)).filter(Boolean);
  t.checks = [
    ...t.expected.filter((x) => x.status === 'pass' || x.status === 'fail').map((x) => ({ label: x.text, pass: x.status === 'pass' })),
    ...stepChecks,
  ];
  if (t.status === 'fail' && !t.failureType) t.failureType = 'untriaged';
  if (t.status !== 'fail') delete t.failureType;
  writeJson(file, results);
  invalidate(slug);
  return t;
}

export function addManualEvidence(slug, runId, id, d) {
  const { dir, file, results } = loadRunFile(slug, runId);
  if (!results.inProgress) bad('This run is finished');
  const t = results.tests.find((x) => x.id === id) || notFound(`Test ${id} in run`);
  const m = /^data:image\/(png|jpeg|webp|gif);base64,(.+)$/s.exec(String(d.data || ''));
  if (!m) bad('Send an image as a data URL (PNG, JPEG, WebP or GIF).');
  const bytes = Buffer.from(m[2], 'base64');
  if (bytes.length > 15 * 1024 * 1024) bad('Image is larger than 15 MB');
  const ext = m[1] === 'jpeg' ? 'jpg' : m[1];
  const n = String((t.evidence || []).length + 1).padStart(2, '0');
  const name = `screenshots/${id}-m${n}-${slugify(d.name || 'attachment') || 'attachment'}.${ext}`;
  fs.writeFileSync(path.join(dir, name), bytes);
  t.evidence = [...(t.evidence || []), name];
  writeJson(file, results);
  invalidate(slug);
  return { path: name, url: fileUrl(dir, name) };
}

export function finishManualRun(slug, runId, d = {}) {
  const { dir, file, results } = loadRunFile(slug, runId);
  if (!results.inProgress) bad('This run is already finished');
  for (const t of results.tests) {
    if (t.status === 'untested') { t.status = 'skipped'; t.notes = [...(t.notes || []), 'Not executed in this manual run.']; }
  }
  results.inProgress = false;
  results.finishedAt = nowIso();
  results.summary = summarizeRun(results.tests);
  if (clean(d.notes)) results.notes = clean(d.notes);
  writeJson(file, results);
  fs.writeFileSync(path.join(dir, 'report.md'), renderReport(results));
  invalidate(slug);
  runReport(slug, runId);
  return runSummary(results);
}

// ---------------------------------------------------------------- plans
function planSummary(pl) {
  return {
    id: pl.id, name: pl.name || pl.id, release: pl.release || '', env: pl.env || '', status: pl.status || 'draft', start: String(pl.start || ''),
    due: String(pl.due || ''), owner: pl.owner || '', description: pl.description || '',
    scope: { tags: (pl.scope && pl.scope.tags) || [], tests: (pl.scope && pl.scope.tests) || [], exclude: (pl.scope && pl.scope.exclude) || [] },
    signoff: pl.signoff || { status: 'pending' }, counts: pl.progress.counts, ready: pl.progress.ready, bugs: pl.progress.bugs, runIds: pl.progress.runs,
    file: rel(pl.file),
  };
}

export function listPlans(slug) {
  return project(slug).m.plans.map(planSummary);
}

export function getPlan(slug, planId) {
  const { p, m } = project(slug);
  const pl = m.plans.find((x) => x.id === planId) || notFound(`Plan ${planId}`);
  const tests = m.tests.filter((t) => pl.progress.ids.includes(t.id)).map((t) => ({
    id: t.id, title: t.title, priority: t.priority, feature: t.feature, automated: !!t.spec, spec: t.spec || null, inPlan: pl.progress.latest[t.id] || null, lastStatus: t.lastStatus,
  }));
  return { ...planSummary(pl), tests, runs: p.runs.filter((r) => r.plan === planId).reverse().map(runSummary) };
}

function planData(d, base = {}) {
  const name = clean(d.name ?? base.name);
  if (!name) bad('Plan name is required.');
  const status = d.status ?? base.status ?? 'draft';
  if (!PLAN_STATUSES.includes(status)) bad('Status must be draft, active or done.');
  const scope = d.scope || base.scope || {};
  return {
    name, release: clean(d.release ?? base.release), env: clean(d.env ?? base.env), status, start: clean(d.start ?? base.start), due: clean(d.due ?? base.due),
    owner: clean(d.owner ?? base.owner), description: clean(d.description ?? base.description),
    scope: { tags: cleanTags(scope.tags), tests: cleanTags(scope.tests), exclude: cleanTags(scope.exclude) },
  };
}

export function createPlan(slug, d) {
  const { p } = project(slug);
  const v = planData(d);
  const id = nextId(p.plans.map((x) => x.id), 'PLAN');
  const file = path.join(p.dir, 'plans', `${id}-${shortSlug(v.name) || 'plan'}.yaml`);
  const obj = { id, ...v, signoff: { status: 'pending', by: '', at: '', note: '' }, created: today(), updated: today() };
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, YAML.stringify(obj));
  invalidate(slug);
  return { id, file: rel(file) };
}

export function updatePlan(slug, planId, d) {
  const { p } = project(slug);
  const pl = p.plans.find((x) => x.id === planId) || notFound(`Plan ${planId}`);
  const { file, progress, ...base } = pl;
  const obj = { ...base, ...planData(d, base), id: planId, updated: today() };
  if (d.signoff) {
    if (!SIGNOFF.includes(d.signoff.status)) bad('Sign-off must be pending, approved or rejected.');
    obj.signoff = { status: d.signoff.status, by: clean(d.signoff.by), at: d.signoff.status === 'pending' ? '' : nowIso(), note: clean(d.signoff.note) };
  }
  fs.writeFileSync(pl.file, YAML.stringify(obj));
  invalidate(slug);
  return getPlan(slug, planId);
}

// ---------------------------------------------------------------- bugs
function bugFrontmatter(fm) {
  return ['---', `id: ${fm.id}`, `title: ${q(fm.title)}`, `severity: ${fm.severity}`, `status: ${fm.status}`, `env: ${fm.env || ''}`, `url: ${fm.url ? q(fm.url) : ''}`,
    `updated: ${fm.updated || fm.found || today()}`, `found: ${fm.found || today()}`, `foundBy: ${fm.foundBy ? q(fm.foundBy) : '""'}`, `tests: ${flow(fm.tests || [])}`, `frequency: ${fm.frequency || 'always'}`, '---', ''].join('\n');
}

export function listBugs(slug) {
  const { p } = project(slug);
  return p.bugs.filter((b) => b.fm && b.fm.id).map((b) => ({
    id: b.fm.id, title: b.fm.title, severity: b.fm.severity, status: b.fm.status, env: b.fm.env || '', url: b.fm.url || '', found: String(b.fm.found || ''),
    tests: b.fm.tests || [], updated: latestIssueDate(b.fm, b.body), file: rel(b.file),
  })).sort((a, b) => (SEVERITIES.indexOf(a.severity) - SEVERITIES.indexOf(b.severity)) || a.id.localeCompare(b.id));
}

export function getBug(slug, bugId) {
  const { p } = project(slug);
  const b = p.bugs.find((x) => x.fm && x.fm.id === bugId) || notFound(`Bug ${bugId}`);
  const image = (src, alt) => {
    const abs = path.resolve(path.dirname(b.file), src);
    const r = rel(abs);
    return r.startsWith('..') ? `<span class="ref">${alt}</span>` : `<img class="zoom" src="/files/${r.split('/').map(encodeURIComponent).join('/')}" alt="${alt}">`;
  };
  return { ...b.fm, found: String(b.fm.found || ''), tests: b.fm.tests || [], file: rel(b.file), body: b.body, html: md(b.body, image) };
}

export function createBug(slug, d) {
  const { p } = project(slug);
  const title = clean(d.title);
  if (!title) bad('Bug title is required.');
  const severity = SEVERITIES.includes(d.severity) ? d.severity : bad('Severity must be critical, major, minor or trivial.');
  const id = nextId(p.bugs.map(idOfDoc), 'BUG');
  const fm = { id, title, severity, status: 'open', env: clean(d.env), url: clean(d.url), found: new Date().toISOString(), foundBy: clean(d.foundBy), tests: cleanTags(d.tests), frequency: clean(d.frequency) || 'always' };
  const steps = cleanList(d.steps);
  const body = [
    '## Summary', clean(d.summary) || title, '',
    '## Steps to reproduce', ...(steps.length ? steps.map((s, i) => `${i + 1}. ${s}`) : ['1. ']), '',
    '## Expected', clean(d.expected) || '-', '',
    '## Actual', clean(d.actual) || '-', '',
    '## Evidence', ...(cleanList(d.evidence).length ? cleanList(d.evidence).map((x) => `- ${x}`) : ['- ']), '',
    '## Environment', `- Base URL: ${clean(d.url) || '-'}`, `- Env: ${clean(d.env) || '-'}`, '',
    '## History', `- ${today()}: filed${fm.foundBy ? ` from ${fm.foundBy}` : ''} in the Test Manager app.`, '',
  ].join('\n');
  const file = path.join(p.dir, 'bugs', `${id}-${shortSlug(title) || 'bug'}.md`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, bugFrontmatter(fm) + body);
  invalidate(slug);
  return { id, file: rel(file) };
}

export function updateBug(slug, bugId, d) {
  const { p } = project(slug);
  const b = p.bugs.find((x) => x.fm && x.fm.id === bugId) || notFound(`Bug ${bugId}`);
  const fm = { ...b.fm };
  const changes = [];
  if (d.status !== undefined && d.status !== fm.status) {
    if (!BUG_STATUSES.includes(d.status)) bad('Unknown bug status');
    changes.push(`status ${fm.status} -> ${d.status}`);
    fm.status = d.status;
  }
  if (d.severity !== undefined && d.severity !== fm.severity) {
    if (!SEVERITIES.includes(d.severity)) bad('Unknown severity');
    changes.push(`severity ${fm.severity} -> ${d.severity}`);
    fm.severity = d.severity;
  }
  if (d.title !== undefined && clean(d.title)) fm.title = clean(d.title);
  if (d.tests !== undefined) fm.tests = cleanTags(d.tests);
  let body = b.body;
  const note = clean(d.note);
  if (changes.length || note) {
    const line = `- ${today()}: ${[...changes, note].filter(Boolean).join('; ')}.`;
    body = /^##\s+History\s*$/m.test(body) ? body.replace(/\s*$/, '\n') + line + '\n' : body.replace(/\s*$/, '\n\n') + `## History\n${line}\n`;
  }
  fm.updated = new Date().toISOString();
  fs.writeFileSync(b.file, bugFrontmatter(fm) + body.replace(/^\n+/, ''));
  invalidate(slug);
  return getBug(slug, bugId);
}

// ---------------------------------------------------------------- questions
// Open questions for the product owner (unclear intended behavior found while testing), one Markdown file each:
// projects/<slug>/questions/Q-NNN-<slug>.md with ## Question, ## Context, ## Answer, ## History.
function questionFrontmatter(fm) {
  return ['---', `id: ${fm.id}`, `title: ${q(fm.title)}`, `status: ${fm.status}`, `askedTo: ${fm.askedTo ? q(fm.askedTo) : '""'}`, `env: ${fm.env || ''}`,
    `found: ${fm.found || today()}`, `foundBy: ${fm.foundBy ? q(fm.foundBy) : '""'}`, `tests: ${flow(fm.tests || [])}`, `bugs: ${flow(fm.bugs || [])}`,
    `updated: ${fm.updated || fm.found || today()}`, `answered: ${fm.answered || '""'}`, '---', ''].join('\n');
}

const questionRow = (x) => ({
  id: x.fm.id, title: x.fm.title, status: x.fm.status || 'open', askedTo: x.fm.askedTo || '', env: x.fm.env || '', found: String(x.fm.found || ''),
  updated: latestIssueDate(x.fm, x.body), answered: String(x.fm.answered || ''), tests: x.fm.tests || [], bugs: x.fm.bugs || [], file: rel(x.file),
});

export function listQuestions(slug) {
  const { p } = project(slug);
  return p.questions.filter((x) => x.fm && x.fm.id).map(questionRow)
    .sort((a, b) => (QUESTION_STATUSES.indexOf(a.status) - QUESTION_STATUSES.indexOf(b.status)) || a.id.localeCompare(b.id, undefined, { numeric: true }));
}

export function getQuestion(slug, qid) {
  const { p } = project(slug);
  const x = p.questions.find((d) => d.fm && d.fm.id === qid) || notFound(`Question ${qid}`);
  const image = (src, alt) => {
    const r = rel(path.resolve(path.dirname(x.file), src));
    return r.startsWith('..') ? `<span class="ref">${alt}</span>` : `<img class="zoom" src="/files/${r.split('/').map(encodeURIComponent).join('/')}" alt="${alt}">`;
  };
  const answer = (/^##\s+Answer\s*$([\s\S]*?)(?=^##\s|(?![\s\S]))/m.exec(x.body) || [])[1];
  return { ...questionRow(x), body: x.body, html: md(x.body, image), answer: clean(answer) === 'Not answered yet.' ? '' : clean(answer) };
}

export function createQuestion(slug, d) {
  const { p } = project(slug);
  const title = clean(d.title);
  if (!title) bad('Question title is required.');
  const id = nextId(p.questions.map(idOfDoc), 'Q');
  const fm = { id, title, status: 'open', askedTo: clean(d.askedTo), env: clean(d.env), found: new Date().toISOString(), foundBy: clean(d.foundBy), tests: cleanTags(d.tests), bugs: cleanTags(d.bugs) };
  const body = [
    '## Question', clean(d.question) || title, '',
    '## Context', clean(d.context) || '-', '',
    ...(cleanList(d.evidence).length ? ['## Evidence', ...cleanList(d.evidence).map((e) => `- ${e}`), ''] : []),
    '## Answer', 'Not answered yet.', '',
    '## History', `- ${today()}: asked${fm.foundBy ? ` from ${fm.foundBy}` : ''}.`, '',
  ].join('\n');
  const file = path.join(p.dir, 'questions', `${id}-${shortSlug(title) || 'question'}.md`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, questionFrontmatter(fm) + body);
  invalidate(slug);
  return { id, file: rel(file) };
}

// answer: replaces the ## Answer section and marks the question answered (unless a status is given).
export function updateQuestion(slug, qid, d) {
  const { p } = project(slug);
  const x = p.questions.find((e) => e.fm && e.fm.id === qid) || notFound(`Question ${qid}`);
  const fm = { ...x.fm, status: x.fm.status || 'open' };
  const changes = [];
  let body = x.body;
  const answer = clean(d.answer);
  if (answer) {
    const section = `## Answer\n${answer}\n\n`;
    body = /^##\s+Answer\s*$/m.test(body)
      ? body.replace(/^##\s+Answer\s*$[\s\S]*?(?=^##\s|(?![\s\S]))/m, section)
      : body.replace(/^##\s+History\s*$/m, `${section}## History`);
    changes.push('answer recorded');
    if (d.status === undefined && fm.status === 'open') d = { ...d, status: 'answered' };
  }
  if (d.status !== undefined && d.status !== fm.status) {
    if (!QUESTION_STATUSES.includes(d.status)) bad('Status must be open, answered or closed.');
    changes.push(`status ${fm.status} -> ${d.status}`);
    fm.status = d.status;
    fm.answered = d.status === 'open' ? '' : (fm.answered || new Date().toISOString());
  }
  if (d.title !== undefined && clean(d.title)) fm.title = clean(d.title);
  if (d.askedTo !== undefined) fm.askedTo = clean(d.askedTo);
  if (d.tests !== undefined) fm.tests = cleanTags(d.tests);
  if (d.bugs !== undefined) fm.bugs = cleanTags(d.bugs);
  const note = clean(d.note);
  if (changes.length || note) {
    const line = `- ${today()}: ${[...changes, note].filter(Boolean).join('; ')}.`;
    body = /^##\s+History\s*$/m.test(body) ? body.replace(/\s*$/, '\n') + line + '\n' : body.replace(/\s*$/, '\n\n') + `## History\n${line}\n`;
  }
  fm.updated = new Date().toISOString();
  fs.writeFileSync(x.file, questionFrontmatter(fm) + body.replace(/^\n+/, ''));
  invalidate(slug);
  return getQuestion(slug, qid);
}

// ---------------------------------------------------------------- files
export function resolveFile(urlPath) {
  let relPath;
  try { relPath = decodeURIComponent(urlPath).replace(/^\/+/, ''); } catch { return null; }
  const abs = path.resolve(ROOT, relPath);
  const r = path.relative(ROOT, abs);
  if (!r || r.startsWith('..') || path.isAbsolute(r)) return null;
  const seg = r.split(path.sep);
  if (seg.some((s) => s.startsWith('.'))) return null;
  // explorations/: bug reports link their screenshots there (qa-explore skill), so it must be served too.
  const allowed = (seg[0] === 'projects' && ['runs', 'bugs', 'explorations'].includes(seg[2])) || seg[0] === 'reports';
  if (!allowed || !fs.existsSync(abs) || !fs.statSync(abs).isFile()) return null;
  return abs;
}

// ---------------------------------------------------------------- Playwright target
// Where and how the app runs a project's POM suite: Playwright project names, env (passed as QA_ENV), base URL, write permission.
export function playwrightTarget(slug, envName) {
  const { p, m } = project(slug);
  const env = envName || m.cfg.defaultEnv;
  const e = (m.cfg.envs || {})[env] || bad(`Unknown environment "${env}"`);
  if (!p.specs.length) bad(`No Playwright specs found in ${rel(p.specDir)}. Write a POM spec there first (see .agents/skills/qa-write-tests, Part B).`);
  return { pwProjects: playwrightProjectsOf(m.cfg, slug), env, baseUrl: e.baseUrl, allowWrites: !!e.allowWrites };
}
