// Test Manager CLI and the workspace's command entry point. PowerShell: .\qa <command> (qa.ps1 finds node.exe).
// `.\qa help` lists the commands. Read commands print one line per item, so agents rarely need the raw files.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT, projectSlugs, rel } from './lib/workspace.mjs';

const HELP = `Usage: .\\qa <command> [args]      (same as: node test-manager/cli.mjs <command> [args])

Run (from the workspace root; the exit code passes through)
  test [playwright args]        Playwright, root config: test --project=mha-spf --grep "SPF-001:|SPF-002:"
  auto [playwright args]        test:auto: one retry, then sorts the results. Exit 0 all good, 1 broken (heal request
                                in reports/heal/), 2 environment problems only, 3 nothing ran
  mhm [playwright args]         MHA Mobile suite (projects/mha-mobile/playwright.config.ts, mobilewright)
  trace <trace.zip>             open a Playwright trace in the trace viewer
  typecheck | lint | check      tsc --noEmit | Test Manager lint | both (run check before every commit)

Read (one line per item)
  tests <slug> [--auto|--manual] [--priority P0,P1] [--tag smoke] [--feature f] [--grep text]
  bugs <slug> [--open | --status s]   every status by default (wont-fix = accepted behavior, do not re-report)
  questions <slug> [--open | --status s]
  runs <slug> [--limit 10]
  failures <slug> [runId]       fail/flaky/blocked results of a run (default: newest finished run): error, failed
                                checks, evidence paths, error-context (Playwright's page snapshot at the failure)
  find <text> [path...]         case-insensitive git grep that skips projects/*/runs [--regex] [--max 200]

Write (Test Manager store: test-manager/lib/store.mjs)
  call <fn> [args...]           any store function. Args: plain strings; key=value pairs (merged into one object,
                                passed last); {...} or [...] JSON; @file.json. Example:
                                call updateBug mha-spf BUG-002 status=verified "note=Retest passed in runs/<runId>"
  evidence <slug> <runId> <id> <image> [name]   attach a screenshot to a result of an open manual run

App
  app [--port 7358] [--open]    Test Manager web app (npm run tm)
  new <slug> --url <baseUrl> [--name "App"] [--env staging] [--prefix APP] [--read-only]
  report                        rebuild the overview report reports/index.html`;

const [cmd = 'help', ...rest] = process.argv.slice(2);

// --key value | --key=value | --flag ; everything else is positional.
function parse(list) {
  const pos = [];
  const opt = {};
  for (let i = 0; i < list.length; i++) {
    const a = list[i];
    if (!a.startsWith('--')) { pos.push(a); continue; }
    const eq = a.indexOf('=');
    if (eq > 0) { opt[a.slice(2, eq)] = a.slice(eq + 1); continue; }
    const k = a.slice(2);
    opt[k] = list[i + 1] !== undefined && !list[i + 1].startsWith('--') ? list[++i] : true;
  }
  return { pos, opt };
}

const fail = (msg) => { console.error(msg); process.exit(1); };
const short = (s, n = 220) => (s.length > n ? s.slice(0, n - 3) + '...' : s);

function run(args) {
  const r = spawnSync(process.execPath, args, { cwd: ROOT, stdio: 'inherit', env: process.env });
  if (r.error) { console.error(r.error.message); return 1; }
  return r.status ?? 1;
}
const PW = path.join(ROOT, 'node_modules', 'playwright', 'cli.js');
const TSC = path.join(ROOT, 'node_modules', 'typescript', 'bin', 'tsc');

async function lintAll() {
  const { lintSlug, lintShared } = await import('./lib/lint.mjs');
  let errors = 0;
  const clean = [];
  const results = projectSlugs().map((slug) => [slug, lintSlug(slug)]);
  results.push(['shared', lintShared()]);
  for (const [slug, { E, W }] of results) {
    errors += E.length;
    if (!E.length && !W.length) { clean.push(slug); continue; }
    console.log(`${slug}: ${E.length} error(s), ${W.length} warning(s)`);
    for (const e of E) console.log(`  ERROR ${e}`);
    for (const w of W) console.log(`  warn  ${w}`);
  }
  if (clean.length) console.log(`lint clean: ${clean.join(', ')}`);
  return errors;
}

const slugArg = (pos) => {
  const slug = pos[0];
  if (!slug) fail(`Usage: .\\qa ${cmd} <slug> ...  (projects: ${projectSlugs().join(', ')})`);
  if (!projectSlugs().includes(slug)) fail(`Unknown project "${slug}" (projects: ${projectSlugs().join(', ')})`);
  return slug;
};

// Value of a key=value argument: true/false/null, JSON for {...}/[...], otherwise the string itself.
function value(v) {
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (v === 'null') return null;
  if (/^[[{]/.test(v)) { try { return JSON.parse(v); } catch { /* keep the string */ } }
  return v;
}
// Rendered HTML duplicates the Markdown body; leave it out of CLI output.
function withoutHtml(x) {
  if (Array.isArray(x)) return x.map(withoutHtml);
  if (x && typeof x === 'object') return Object.fromEntries(Object.entries(x).filter(([k]) => k !== 'html').map(([k, v]) => [k, withoutHtml(v)]));
  return x;
}
const BUG_ORDER = ['open', 'fixed', 'verified', 'wont-fix', 'duplicate'];
const num = (id) => Number(String(id).replace(/\D+/g, '')) || 0;

const commands = {
  help: () => console.log(HELP),

  // ------------------------------------------------------------ run
  test: () => process.exit(run([PW, 'test', ...rest])),
  auto: () => process.exit(run([path.join(ROOT, 'test-manager', 'run-auto.mjs'), ...rest])),
  mhm: () => process.exit(run([PW, 'test', '-c', 'projects/mha-mobile/playwright.config.ts', ...rest])),
  trace: () => process.exit(run([PW, 'show-trace', ...rest])),
  typecheck: () => process.exit(run([TSC, '--noEmit', '-p', 'tsconfig.json'])),
  lint: async () => process.exit((await lintAll()) ? 1 : 0),
  check: async () => {
    const t = run([TSC, '--noEmit', '-p', 'tsconfig.json']);
    const e = await lintAll();
    console.log(!t && !e ? 'check OK: typecheck + lint' : `check FAILED:${t ? ' typecheck' : ''}${e ? ` ${e} lint error(s)` : ''}`);
    process.exit(t || e ? 1 : 0);
  },

  // ------------------------------------------------------------ read
  tests: async () => {
    const { pos, opt } = parse(rest);
    const S = await import('./lib/store.mjs');
    let rows = S.listTests(slugArg(pos));
    if (opt.auto) rows = rows.filter((t) => t.automated);
    if (opt.manual) rows = rows.filter((t) => !t.automated);
    if (opt.priority) { const ps = String(opt.priority).split(','); rows = rows.filter((t) => ps.includes(t.priority)); }
    if (opt.tag) rows = rows.filter((t) => t.tags.includes(String(opt.tag).replace(/^@/, '')));
    if (opt.feature) rows = rows.filter((t) => t.feature === opt.feature);
    if (opt.grep) { const g = String(opt.grep).toLowerCase(); rows = rows.filter((t) => `${t.id} ${t.title}`.toLowerCase().includes(g)); }
    for (const t of rows) {
      const bugs = (t.bugs || []).map((b) => (typeof b === 'string' ? b : b.id)).filter(Boolean);
      console.log(`${t.id} ${t.priority || '-'} ${t.automated ? 'auto' : 'manual'} last:${t.lastStatus || '-'} [${t.tags.join(',')}] ${t.feature}: ${t.title}${bugs.length ? ` (open bugs ${bugs.join(',')})` : ''}`);
    }
    console.log(`${rows.length} test case(s)`);
  },
  bugs: async () => {
    const { pos, opt } = parse(rest);
    const S = await import('./lib/store.mjs');
    let rows = S.listBugs(slugArg(pos));
    if (opt.open) rows = rows.filter((b) => b.status === 'open');
    if (opt.status) rows = rows.filter((b) => b.status === opt.status);
    rows.sort((a, b) => (BUG_ORDER.indexOf(a.status) - BUG_ORDER.indexOf(b.status)) || num(a.id) - num(b.id));
    for (const b of rows) console.log(`${b.id} ${b.status} ${b.severity} ${b.title}${b.tests.length ? ` [tests ${b.tests.join(',')}]` : ''}`);
    console.log(`${rows.length} bug(s); details: .\\qa call getBug <slug> <id>`);
  },
  questions: async () => {
    const { pos, opt } = parse(rest);
    const S = await import('./lib/store.mjs');
    let rows = S.listQuestions(slugArg(pos));
    if (opt.open) rows = rows.filter((q) => q.status === 'open');
    if (opt.status) rows = rows.filter((q) => q.status === opt.status);
    for (const q of rows) console.log(`${q.id} ${q.status} ${q.title}${q.askedTo ? ` (asked: ${q.askedTo})` : ''}${q.bugs.length ? ` [bugs ${q.bugs.join(',')}]` : ''}${q.tests.length ? ` [tests ${q.tests.join(',')}]` : ''}`);
    console.log(`${rows.length} question(s); details: .\\qa call getQuestion <slug> <id>`);
  },
  runs: async () => {
    const { pos, opt } = parse(rest);
    const S = await import('./lib/store.mjs');
    const rows = S.listRuns(slugArg(pos)).slice(0, Number(opt.limit || 10));
    for (const r of rows) {
      const s = r.summary || {};
      const counts = ['pass', 'fail', 'flaky', 'blocked', 'skipped', 'untested'].filter((k) => s[k]).map((k) => `${s[k]} ${k}`).join(', ');
      console.log(`${r.runId} ${r.verdict?.text || r.verdict || ''} (${counts || 'empty'}) suite:${r.suite || '-'}${r.inProgress ? ' IN PROGRESS' : ''}`);
    }
  },
  failures: async () => {
    const { pos } = parse(rest);
    const slug = slugArg(pos);
    const S = await import('./lib/store.mjs');
    const all = S.listRuns(slug);
    const runId = pos[1] || all.find((r) => !r.inProgress && !r.pseudo)?.runId;
    if (!runId) fail(`No finished run in ${slug}`);
    const run = S.getRun(slug, runId);
    const s = run.summary || {};
    const dir = `projects/${slug}/runs/${runId}`;
    console.log(`${slug} ${runId} ${run.verdict?.text || run.verdict || ''}: ${['pass', 'fail', 'flaky', 'blocked', 'skipped'].map((k) => `${s[k] || 0} ${k}`).join(', ')}`);
    const newestPw = all.find((r) => r.runner === 'playwright' && !r.inProgress)?.runId === runId;
    const bad = (run.tests || []).filter((t) => ['fail', 'flaky', 'blocked'].includes(t.status));
    for (const t of bad) {
      console.log(`${t.id} ${t.status}${t.failureType ? ` [${t.failureType}${t.bug ? ` ${t.bug}` : ''}]` : ''} ${t.file || ''}`);
      for (const l of String(t.error || '').split('\n').map((x) => x.trim()).filter(Boolean).slice(0, 4)) console.log(`  ${short(l)}`);
      const failed = (t.checks || []).filter((c) => !c.pass).map((c) => c.label);
      if (failed.length) console.log(`  failed checks: ${short(failed.slice(0, 3).join(' | '), 300)}`);
      const ev = (t.evidence || []).map((e) => (typeof e === 'string' ? e : e.path));
      if (ev.length) console.log(`  evidence: ${ev.map((e) => `${dir}/${e}`).join(', ')}`);
      if (newestPw) {
        const res = path.join(ROOT, 'reports', 'test-results');
        const ctx = fs.existsSync(res) ? fs.readdirSync(res).filter((d) => d.toLowerCase().includes(t.id.toLowerCase())).map((d) => path.join(res, d, 'error-context.md')).filter((f) => fs.existsSync(f)) : [];
        if (ctx.length) console.log(`  error-context: ${ctx.map(rel).join(', ')}`);
      }
      if (t.notes?.length) console.log(`  notes: ${short(t.notes.join(' | '), 300)}`);
    }
    if (!bad.length) console.log('No failed, flaky or blocked results.');
  },
  find: () => {
    const { pos, opt } = parse(rest);
    if (!pos[0]) fail('Usage: .\\qa find <text> [path...] [--regex] [--max 200]');
    const r = spawnSync('git', ['grep', '-n', '-I', '-i', opt.regex ? '-E' : '-F', '--no-color', '-e', pos[0], '--', ...(pos.length > 1 ? pos.slice(1) : ['.']),
      ':(exclude)projects/*/runs/*', ':(exclude)package-lock.json', ':(exclude)test-manager/public/vendor/*'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    if (r.error) fail(r.error.message);
    const lines = (r.stdout || '').split('\n').filter(Boolean);
    const max = Number(opt.max || 200);
    for (const l of lines.slice(0, max)) console.log(short(l, 240));
    if (lines.length > max) console.log(`... ${lines.length - max} more line(s); narrow it with a path or --max`);
    if (!lines.length) console.log(r.stderr ? r.stderr.trim() : 'No matches (projects/*/runs is skipped).');
  },

  // ------------------------------------------------------------ write
  call: async () => {
    const [fn, ...raw] = rest;
    const S = await import('./lib/store.mjs');
    const fns = Object.keys(S).filter((k) => typeof S[k] === 'function');
    if (!fn || !fns.includes(fn)) fail(`${fn ? `Unknown store function "${fn}". ` : 'Usage: .\\qa call <fn> [args...]. '}Functions: ${fns.join(', ')}`);
    const args = [];
    let obj = null;
    for (const a of raw) {
      if (a.startsWith('@')) args.push(JSON.parse(fs.readFileSync(path.resolve(a.slice(1)), 'utf8')));
      else if (/^[[{]/.test(a)) args.push(JSON.parse(a));
      else if (/^[A-Za-z_]\w*=/.test(a)) { const i = a.indexOf('='); (obj ||= {})[a.slice(0, i)] = value(a.slice(i + 1)); }
      else args.push(a);
    }
    if (obj) args.push(obj);
    try {
      const res = await S[fn](...args);
      console.log(res === undefined ? 'ok' : JSON.stringify(withoutHtml(res)));
    } catch (e) { fail(`error: ${e.message}`); }
  },
  evidence: async () => {
    const [slug, runId, id, image, name] = rest;
    if (!image) fail('Usage: .\\qa evidence <slug> <runId> <id> <image> [name]');
    const mime = { png: 'png', jpg: 'jpeg', jpeg: 'jpeg', webp: 'webp', gif: 'gif' }[path.extname(image).slice(1).toLowerCase()];
    if (!mime) fail('The image must be .png, .jpg, .jpeg, .webp or .gif');
    const S = await import('./lib/store.mjs');
    try {
      const r = S.addManualEvidence(slug, runId, id, { data: `data:image/${mime};base64,${fs.readFileSync(path.resolve(image)).toString('base64')}`, name: name || path.basename(image, path.extname(image)) });
      console.log(r.path);
    } catch (e) { fail(`error: ${e.message}`); }
  },

  // ------------------------------------------------------------ app
  app: async () => {
    const { opt } = parse(rest);
    const { startServer } = await import('./server.mjs');
    await startServer({ port: Number(opt.port || process.env.QA_APP_PORT || 7358), open: !!opt.open });
  },
  new: async () => {
    const { pos, opt } = parse(rest);
    const slug = pos[0];
    if (!slug || !opt.url) fail('Usage: .\\qa new <slug> --url <baseUrl> [--name "App"] [--env staging] [--prefix APP] [--read-only]');
    const { createProject } = await import('./lib/store.mjs');
    try {
      const r = createProject({ slug, url: opt.url, name: opt.name, env: opt.env, prefix: opt.prefix, readOnly: !!opt['read-only'] });
      console.log(`Created projects/${r.slug} (test IDs ${r.prefix}-001..., env ${r.env}, writes ${r.allowWrites ? 'allowed' : 'skipped'})`);
      console.log(`Run its smoke test: .\\qa test --project=${r.slug}`);
    } catch (e) { fail(e.message); }
  },
  report: async () => {
    const { buildHtmlReport } = await import('./lib/html-report.mjs');
    const { buildMissingRunReports } = await import('./lib/run-report.mjs');
    buildMissingRunReports();
    const r = buildHtmlReport();
    console.log(`Overview report: ${rel(r.out)} (${r.kb} KB, ${r.projects} project(s))`);
  },
};

if (!commands[cmd]) { console.log(HELP); process.exit(1); }
await commands[cmd]();
