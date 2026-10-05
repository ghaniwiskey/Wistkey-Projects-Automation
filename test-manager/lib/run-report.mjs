// Per-run HTML test report: projects/<slug>/runs/<runId>/report.html
// Self-contained (screenshots embedded): summary, comparison with the previous run, results table, and a
// section per test with what was tested, every check, errors, console/network issues, evidence, and bugs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT, loadProject, sections, rel, fmtDate, isPseudoRun } from './workspace.mjs';
import {
  esc, when, dur, pct, badge, statusBar, counts, verdict, checksList, issuesBlock, a11yTable, perfCells, makeImager, stripId,
  versionOf, kpi, summaryOf, runMs, shots, REPORT_CSS, REPORT_JS, RUNNER_LABEL, STATUS_LABEL,
} from './html-report.mjs';

const GENERATORS = [fileURLToPath(import.meta.url), path.join(path.dirname(fileURLToPath(import.meta.url)), 'html-report.mjs')];
const BAD = (s) => s === 'fail' || s === 'blocked';
const items = (txt) => String(txt || '').split('\n').map((l) => l.trim()).filter(Boolean).map((l) => l.replace(/^(?:[-*]|\d+[.)])\s+(?:\[[ xX]\]\s+)?/, ''));
const inlineMd = (s) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/-&gt; Expect:/g, '<strong>Expect:</strong>');
const RUNNER_HELP = {
  playwright: 'Playwright ran the POM specs (tests/e2e)',
  manual: 'A person executed the steps and recorded each result',
};

// ---------------------------------------------------------------- freshness
export function isReportFresh(runDir) {
  const out = path.join(runDir, 'report.html');
  if (!fs.existsSync(out)) return false;
  const t = fs.statSync(out).mtimeMs;
  return [path.join(runDir, 'results.json'), ...GENERATORS].every((f) => !fs.existsSync(f) || fs.statSync(f).mtimeMs <= t);
}

// ---------------------------------------------------------------- comparison
// Latest earlier finished run that shares tests with this one; prefer the same suite.
function previousRun(p, r) {
  const ids = new Set((r.tests || []).map((t) => t.id));
  const earlier = p.runs.filter((x) => x !== r && !x.inProgress && String(x.startedAt) < String(r.startedAt)
    && (x.tests || []).some((t) => ids.has(t.id)));
  const same = earlier.filter((x) => x.suite === r.suite);
  if (same.length) return same[same.length - 1];
  const others = earlier.filter((x) => !isPseudoRun(x) || isPseudoRun(r));
  return others.length ? others[others.length - 1] : null;
}

function compare(prev, r) {
  const before = new Map((prev.tests || []).map((t) => [t.id, t]));
  const out = { newFailures: [], fixed: [], stillFailing: [], newTests: [], same: 0, prevMs: 0, curMs: 0, common: 0 };
  for (const t of r.tests || []) {
    const bt = before.get(t.id);
    const b = bt && bt.status;
    if (bt) { out.common++; out.prevMs += bt.durationMs || 0; out.curMs += t.durationMs || 0; }
    if (b === undefined) out.newTests.push(t.id);
    else if (BAD(t.status) && !BAD(b)) out.newFailures.push(t.id);
    else if (!BAD(t.status) && BAD(b)) out.fixed.push(t.id);
    else if (BAD(t.status) && BAD(b)) out.stillFailing.push(t.id);
    else out.same++;
  }
  return out;
}

// ---------------------------------------------------------------- rendering
function idLinks(ids) {
  return ids.map((id) => `<a href="#t-${esc(id)}">${esc(id)}</a>`).join(', ');
}

function comparisonBlock(p, r) {
  const prev = previousRun(p, r);
  if (!prev) return '<p class="muted small">No earlier run of these tests to compare with.</p>';
  const c = compare(prev, r);
  const pv = verdict(summaryOf(prev));
  const rows = [
    c.newFailures.length ? `<li class="bad">New failures: ${idLinks(c.newFailures)}</li>` : '',
    c.stillFailing.length ? `<li class="warn">Still failing: ${idLinks(c.stillFailing)}</li>` : '',
    c.fixed.length ? `<li class="good">Fixed since then: ${idLinks(c.fixed)}</li>` : '',
    c.same ? `<li class="good">Same result as before: ${c.same} test${c.same === 1 ? '' : 's'}</li>` : '',
    c.newTests.length ? `<li>Not in that run: ${idLinks(c.newTests)}</li>` : '',
  ].filter(Boolean).join('');
  const sameRunner = prev.runner === r.runner;
  const delta = sameRunner && c.prevMs ? Math.round(((c.curMs - c.prevMs) / c.prevMs) * 100) : null;
  return `<p class="small">Compared with <code>${esc(prev.runId)}</code> (${esc(RUNNER_LABEL[prev.runner] || prev.runner)}, ${esc(when(prev.startedAt))}), ${c.common} test${c.common === 1 ? '' : 's'} in common: ${badge(pv.cls, pv.text)}`
    + `${delta !== null ? `. Test time for those tests ${delta >= 0 ? '+' : ''}${delta}% (${dur(c.prevMs)} to ${dur(c.curMs)})` : ''}.</p><ul class="insights">${rows}</ul>`;
}

const argText = (args) => Object.entries(args || {}).filter(([, v]) => v !== '' && v != null).map(([k, v]) => `${k}=${v}`).join(', ');
const flowHead = (f) => `<span class="tag flow">Flow</span> ${esc(f.title || f.name)}${argText(f.args) ? ` <span class="muted small">(${esc(argText(f.args))})</span>` : ''}`;

// Steps as executed (manual runs), flows nested with their own result.
function resultTree(steps, prefix = '') {
  const mark = (s) => `<span class="mark">${esc((s === 'pass' ? 'done' : s === 'skipped' ? 'skip' : s || '-').toUpperCase())}</span>`;
  const cls = (s) => (s === 'fail' ? 'ko' : s === 'pass' ? 'ok' : '');
  return `<ul class="checks">${steps.map((s, i) => {
    const num = `${prefix}${i + 1}`;
    if (s.kind === 'flow') return `<li class="${cls(s.status)}">${mark(s.status)}${num}. ${flowHead(s)}${s.status === 'skipped' ? ' <span class="muted small">(already in place)</span>' : ''}<div style="margin-left:22px">${resultTree(s.steps || [], `${num}.`)}</div></li>`;
    return `<li class="${cls(s.status)}">${mark(s.status)}${num}. ${inlineMd(s.text)}</li>`;
  }).join('')}</ul>`;
}

function definition(t, doc) {
  // Manual runs carry the steps as executed, with a result per step and per expected result.
  if (Array.isArray(t.steps) && t.steps.length && typeof t.steps[0] === 'object') {
    const mark = (s) => `<span class="mark">${esc((s || '-').toUpperCase())}</span>`;
    const cls = (s) => (s === 'fail' ? 'ko' : s === 'pass' ? 'ok' : '');
    return `<h5>Steps as executed</h5>${resultTree(t.steps)}`
      + `<h5>Expected results</h5><ul class="checks">${(t.expected || []).map((s) => `<li class="${cls(s.status)}">${mark(s.status)}${inlineMd(s.text)}</li>`).join('')}</ul>`
      + ((t.preconditions || []).length ? `<h5>Preconditions</h5><ul>${t.preconditions.map((x) => `<li>${inlineMd(x)}</li>`).join('')}</ul>` : '');
  }
  if (!doc) return '<p class="muted small">No test case file for this ID (scan, exploratory check, or removed test).</p>';
  const sec = sections(doc.body);
  const list = (title, key, tag) => {
    const xs = items(sec[key]);
    return xs.length ? `<h5>${title}</h5><${tag}>${xs.map((x) => `<li>${inlineMd(x)}</li>`).join('')}</${tag}>` : '';
  };
  const steps = list('Steps', 'steps', 'ol');
  return `${sec.goal ? `<p class="muted">${inlineMd(sec.goal)}</p>` : ''}${list('Preconditions', 'preconditions', 'ul')}${list('Data', 'data', 'ul')}${steps}${list('Expected', 'expected', 'ul')}`
    + `<p class="muted small">Test case: <code>${esc(rel(doc.file))}</code> (current version)</p>`;
}

function testSection(t, ctx) {
  const doc = ctx.docs.get(t.id);
  const fm = (doc && doc.fm) || {};
  const checks = t.checks || [];
  const passed = checks.filter((c) => c.pass).length;
  const open = ['fail', 'flaky', 'blocked'].includes(t.status) ? ' open' : '';
  const bugIds = [...new Set([...(t.bug ? [t.bug] : []), ...(ctx.bugsByTest.get(t.id) || [])])];
  const bugs = bugIds.map((id) => {
    const b = ctx.bugs.get(id);
    return b ? `<li><strong>${esc(id)}</strong> <span class="sev sev-${esc(b.severity)}">${esc(b.severity)}</span> ${esc(b.status)}: ${esc(b.title)}</li>` : `<li><strong>${esc(id)}</strong></li>`;
  }).join('');
  const facts = [
    `<tr><th>Result</th><td>${badge(t.status)}${t.status === 'fail' ? ` <span class="muted">failure type: <strong>${esc(t.failureType || 'untriaged')}</strong></span>` : ''}</td></tr>`,
    `<tr><th>Checks</th><td>${checks.length ? `${passed}/${checks.length} passed` : '-'}</td></tr>`,
    `<tr><th>Duration</th><td>${dur(t.durationMs)}${t.attempts > 1 ? `, ${t.attempts} attempts` : ''}</td></tr>`,
    fm.priority ? `<tr><th>Priority</th><td><span class="prio p-${esc(fm.priority)}">${esc(fm.priority)}</span> ${(fm.tags || []).map((x) => `<span class="tag">${esc(x)}</span>`).join(' ')}</td></tr>` : '',
    t.url ? `<tr><th>Last URL</th><td><code>${esc(t.url)}</code></td></tr>` : '',
    t.file ? `<tr><th>Source</th><td><code>${esc(t.file)}</code></td></tr>` : '',
    t.executedAt ? `<tr><th>Executed</th><td>${esc(when(t.executedAt))}</td></tr>` : '',
    (t.flows || []).length ? `<tr><th>Flows</th><td>${t.flows.map((f) => `<span class="tag flow">${esc(f.name)}</span> ${badge(f.status === 'skipped' ? 'skipped' : f.status === 'fail' ? 'fail' : f.status === 'pass' ? 'pass' : 'untested')}`).join(' ')}</td></tr>` : '',
  ].filter(Boolean).join('');
  const history = (t.history || []).map((h, i) => `<li>Attempt ${i + 1}: ${badge(h.status)}${h.failed && h.failed.length ? ` failed: ${esc(h.failed.join('; '))}` : ''}${h.error ? ` <code>${esc(String(h.error).slice(0, 240))}</code>` : ''}</li>`).join('');
  return `<details class="card tc" id="t-${esc(t.id)}"${open}>
<summary>${badge(t.status)} <strong>${esc(t.id)}</strong> <span class="ttl">${esc(stripId(t.title, t.id))}</span><span class="right">${checks.length ? `${passed}/${checks.length} checks` : ''} <span class="muted">${dur(t.durationMs)}</span></span></summary>
<div class="card-body two">
<div><h5>What was tested</h5>${definition(t, doc)}</div>
<div>
<table class="kv"><tbody>${facts}</tbody></table>
${bugs ? `<h5>Bugs</h5><ul>${bugs}</ul>` : ''}
${t.error ? `<h5>Error</h5><pre>${esc(t.error)}</pre>` : ''}
<h5>Checks</h5>${checksList(checks)}
${(t.notes || []).length ? `<h5>Notes</h5><ul>${t.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>` : ''}
${issuesBlock(t.issues)}
${history ? `<h5>Earlier attempts</h5><ul>${history}</ul>` : ''}
</div>
</div>
<div class="card-body">
${shots(ctx.run, t, ctx.img, true)}
${(t.a11y || []).map((a) => `<h5>Accessibility scan: ${esc(a.url)}</h5>${a.violations.length ? a11yTable(a.violations.map((v) => ({ ...v, url: a.url })), false) : '<p class="good-text">No violations.</p>'}`).join('')}
${(t.perf || []).length ? `<h5>Performance</h5><table class="mini"><thead><tr><th>Page</th><th>TTFB</th><th>DOM ready</th><th>Load</th><th>LCP</th><th>CLS</th><th>Resources</th></tr></thead><tbody>${t.perf.map((x) => `<tr><td>${esc(x.url)}</td>${perfCells(x)}</tr>`).join('')}</tbody></table>` : ''}
</div>
</details>`;
}

function resultsTable(tests, ctx) {
  const statuses = ['all', ...['fail', 'flaky', 'blocked', 'pass', 'skipped', 'untested'].filter((s) => tests.some((t) => t.status === s))];
  const prios = [...new Set(tests.map((t) => ((ctx.docs.get(t.id) || {}).fm || {}).priority).filter(Boolean))].sort();
  const chips = statuses.map((s) => `<button type="button" class="chip" data-status="${s}" aria-pressed="${s === 'all'}">${s === 'all' ? 'All' : STATUS_LABEL[s] || s} (${s === 'all' ? tests.length : tests.filter((t) => t.status === s).length})</button>`).join('');
  const rows = tests.map((t) => {
    const fm = ((ctx.docs.get(t.id) || {}).fm) || {};
    const checks = t.checks || [];
    const notes = [t.status === 'fail' ? t.failureType || 'untriaged' : '', t.bug || '', t.issues && t.issues.total ? `${t.issues.total} console/network` : ''].filter(Boolean).join(', ');
    return `<tr data-status="${esc(t.status)}" data-priority="${esc(fm.priority || '')}"><td><a href="#t-${esc(t.id)}"><strong>${esc(t.id)}</strong></a></td><td>${esc(stripId(t.title, t.id))}<div class="muted">${esc(fm.feature || '')}</div></td>`
      + `<td>${fm.priority ? `<span class="prio p-${esc(fm.priority)}">${esc(fm.priority)}</span>` : '-'}</td><td>${badge(t.status)}</td><td>${checks.length ? `${checks.filter((c) => c.pass).length}/${checks.length}` : '-'}</td>`
      + `<td>${dur(t.durationMs)}</td><td>${esc(notes) || '-'}</td><td>${(t.evidence || []).length || '-'}</td></tr>`;
  }).join('');
  return `<div class="filters" data-filter-for="results-table">${chips}${prios.length ? `<select aria-label="Priority"><option value="all">All priorities</option>${prios.map((x) => `<option value="${esc(x)}">${esc(x)}</option>`).join('')}</select>` : ''}<input type="search" placeholder="Search tests" aria-label="Search tests"></div>`
    + `<table class="matrix" id="results-table"><thead><tr><th>ID</th><th>Test</th><th>Priority</th><th>Result</th><th>Checks</th><th>Time</th><th>Notes</th><th>Evidence</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function rerunHelp(p, r, failedIds) {
  failedIds = failedIds.filter((id) => p.tests.some((d) => d.fm && d.fm.id === id));
  if (!failedIds.length) return '';
  const automated = failedIds.filter((id) => p.specs.some((s) => s.ids.includes(id)));
  return `<h3>Rerun the failures</h3><ul class="small">`
    + (automated.length ? `<li>Playwright: <code>npx playwright test --project=${esc(p.slug)} --grep "${automated.map((id) => `${id}:`).join('|')}"</code></li>` : '')
    + `<li>Test Manager: open this run and choose "Rerun failed".</li></ul>`;
}

function renderRunReport(p, r) {
  const img = makeImager({ outDir: r.dir, embed: true, budget: 30 * 1024 * 1024 });
  const docs = new Map(p.tests.filter((d) => d.fm && d.fm.id).map((d) => [d.fm.id, d]));
  const bugs = new Map(p.bugs.filter((b) => b.fm && b.fm.id).map((b) => [b.fm.id, b.fm]));
  const bugsByTest = new Map();
  for (const b of bugs.values()) for (const id of b.tests || []) bugsByTest.set(id, [...(bugsByTest.get(id) || []), b.id]);
  const ctx = { docs, bugs, bugsByTest, img, run: r };
  const order = { fail: 0, blocked: 1, flaky: 2, untested: 3, pass: 4, skipped: 5 };
  const tests = (r.tests || []).slice().sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9) || String(a.id).localeCompare(String(b.id), undefined, { numeric: true }));
  const s = summaryOf(r);
  const v = r.inProgress ? { cls: 'untested', text: 'In progress' } : verdict(s);
  const checks = tests.flatMap((t) => t.checks || []);
  const counted = s.total - (s.skipped || 0) - (s.untested || 0);
  const rate = counted ? pct((s.pass || 0) + (s.flaky || 0), counted) : null;
  const plan = r.plan ? p.plans.find((x) => x.id === r.plan) : null;
  const name = (p.cfg && p.cfg.name) || p.slug;
  const failedIds = tests.filter((t) => BAD(t.status)).map((t) => t.id);
  const meta = [
    ['Project', `${esc(name)} <span class="muted">(${esc(p.slug)})</span>`],
    ['Environment', `${esc(r.env)}: <a href="${esc(r.baseUrl)}" target="_blank" rel="noopener">${esc(r.baseUrl)}</a>`],
    ['Runner', `${esc(RUNNER_LABEL[r.runner] || r.runner)} <span class="muted">${esc(RUNNER_HELP[r.runner] || '')}</span>`],
    ['Started', esc(when(r.startedAt))],
    ['Finished', r.finishedAt ? `${esc(when(r.finishedAt))} (${dur(runMs(r))})` : '<span class="muted">not finished</span>'],
    r.plan ? ['Test plan', `${esc(r.plan)}${plan ? `: ${esc(plan.name)}${plan.release ? ` (release ${esc(plan.release)})` : ''}` : ''}`] : null,
    r.tester ? ['Tester', esc(r.tester)] : null,
    r.workers && r.workers.length > 1 ? ['Workers', esc(r.workers.join(', '))] : null,
    ['Run folder', `<code>${esc(rel(r.dir))}</code>`],
  ].filter(Boolean).map(([k, val]) => `<tr><th>${k}</th><td>${val}</td></tr>`).join('');
  const a11y = tests.flatMap((t) => (t.a11y || []).flatMap((a) => a.violations.map((x) => ({ ...x, url: a.url }))));
  const perf = tests.flatMap((t) => (t.perf || []).map((x) => ({ ...x, test: t.id })));
  const tools = [['Playwright', versionOf('@playwright/test')], ['axe-core', versionOf('axe-core')]].filter(([, x]) => x).map(([k, x]) => `${k} ${x}`).join(', ');
  const generated = fmtDate(new Date());
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Test report: ${esc(p.slug)} / ${esc(r.suite || 'run')} / ${esc(r.runId)}</title>
<style>${REPORT_CSS}${EXTRA_CSS}</style>
</head>
<body>
<header class="top"><div class="wrap bar-row">
<div class="brand">Test report</div>
<nav><a href="#summary">Summary</a><a href="#results">Results</a><a href="#details">Test details</a>${a11y.length || perf.length ? '<a href="#quality">A11y/Perf</a>' : ''}</nav>
<div class="gen">Generated ${esc(generated)} (${esc(tz)})</div>
</div></header>
<main class="wrap">
<section id="summary">
<h1>${esc(name)}: ${esc(r.suite || 'run')}</h1>
<p class="muted">Run <code>${esc(r.runId)}</code></p>
<div class="verdict v-${esc(v.cls)}"><span class="big">${esc(v.text)}</span><span>${s.pass || 0} passed, ${s.fail || 0} failed${s.flaky ? `, ${s.flaky} flaky` : ''}${s.blocked ? `, ${s.blocked} blocked` : ''}${s.skipped ? `, ${s.skipped} skipped` : ''}${s.untested ? `, ${s.untested} untested` : ''} of ${s.total} tests</span></div>
<div class="kpis">
${kpi('Tests', s.total)}
${kpi('Passed', (s.pass || 0) + (s.flaky || 0), s.flaky ? `${s.flaky} flaky` : '', 'good')}
${kpi('Failed', s.fail || 0, '', s.fail ? 'bad' : 'good')}
${kpi('Blocked', s.blocked || 0, '', s.blocked ? 'bad' : '')}
${kpi('Pass rate', rate == null ? '-' : `${rate}%`, 'excluding skipped', rate == null ? '' : rate === 100 ? 'good' : rate >= 80 ? 'warn' : 'bad')}
${kpi('Checks', checks.length ? `${checks.filter((c) => c.pass).length}/${checks.length}` : '-', 'assertions passed')}
${kpi('Duration', dur(runMs(r)), `test time ${dur(tests.reduce((a, t) => a + (t.durationMs || 0), 0))}`)}
</div>
<div class="card pad-box">${statusBar(s)}</div>
<div class="grid2">
<div><h3>Run details</h3><table class="kv"><tbody>${meta}</tbody></table></div>
<div><h3>Compared with the previous run</h3>${comparisonBlock(p, r)}</div>
</div>
${r.notes ? `<h3>Notes</h3><p class="note">${esc(r.notes)}</p>` : ''}
${(r.discarded || []).length ? `<p class="muted small">Discarded attempts (automation errors, not app results): ${r.discarded.map((d) => `${esc(d.id)}: ${esc(d.reason)}`).join('; ')}</p>` : ''}
${rerunHelp(p, r, failedIds)}
</section>
<section id="results"><h3>Results</h3>${tests.length ? resultsTable(tests, ctx) : '<p class="muted">This run has no test results.</p>'}</section>
<section id="details"><h3>Test details <button type="button" class="mini-btn" data-toggle="details-list">Expand all</button></h3>
<div id="details-list">${tests.map((t) => testSection(t, ctx)).join('\n')}</div></section>
${a11y.length || perf.length ? `<section id="quality"><h3>Accessibility and performance</h3>${a11y.length ? a11yTable(a11y) : ''}${perf.length ? `<table class="mini"><thead><tr><th>Page</th><th>TTFB</th><th>DOM ready</th><th>Load</th><th>LCP</th><th>CLS</th><th>Resources</th></tr></thead><tbody>${perf.map((x) => `<tr><td>${esc(x.url)} <span class="muted">(${esc(x.test)})</span></td>${perfCells(x)}</tr>`).join('')}</tbody></table>` : ''}</section>` : ''}
</main>
<footer class="wrap"><p class="muted small">Generated by <code>test-manager/lib/run-report.mjs</code> from <code>${esc(rel(path.join(r.dir, 'results.json')))}</code>${tools ? ` with ${esc(tools)}` : ''}. Workspace <code>${esc(ROOT)}</code>. Markdown version: <code>report.md</code> in the same folder.</p></footer>
<div id="lightbox" hidden><img alt="Enlarged screenshot"><p>Click or press Escape to close</p></div>
<script>${REPORT_JS}</script>
</body>
</html>`;
}

const EXTRA_CSS = `
.verdict{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding:12px 16px;border-radius:8px;margin:12px 0;border:1px solid var(--border);background:#fff;font-size:14px}
.verdict .big{font-size:20px;font-weight:700}
.v-pass{border-left:6px solid var(--pass)}.v-pass .big{color:#116329}
.v-fail{border-left:6px solid var(--fail)}.v-fail .big{color:#a40e26}
.v-flaky{border-left:6px solid var(--flaky)}.v-flaky .big{color:#6f4400}
.v-blocked{border-left:6px solid var(--blocked)}.v-blocked .big{color:#6639ba}
.v-untested,.v-skipped{border-left:6px solid var(--skipped)}
.pad-box{padding:10px 14px;margin-bottom:6px}
.card-body+.card-body{padding-top:0}
section{margin-bottom:10px}
`;

export function buildRunReport(slug, runId, { force = false, project = null } = {}) {
  const p = project || loadProject(slug);
  const r = p.runs.find((x) => x.runId === runId);
  if (!r) throw new Error(`Run ${runId} not found in project ${slug}`);
  const out = path.join(r.dir, 'report.html');
  if (!force && isReportFresh(r.dir)) return { out, fresh: true };
  const html = renderRunReport(p, r);
  fs.writeFileSync(out, html);
  return { out, fresh: false, kb: Math.round(Buffer.byteLength(html) / 1024) };
}

// Build missing or outdated run reports for a project (skips unfinished manual runs).
export function buildStaleRunReports(slug) {
  const p = loadProject(slug);
  const built = [];
  for (const r of p.runs) {
    if (r.inProgress || isReportFresh(r.dir)) continue;
    fs.writeFileSync(path.join(r.dir, 'report.html'), renderRunReport(p, r));
    built.push(r.runId);
  }
  return built;
}
