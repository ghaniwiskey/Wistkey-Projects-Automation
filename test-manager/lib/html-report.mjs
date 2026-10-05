// Self-contained HTML test report: overview, insights, run history chart, run details with checks and
// screenshots, test matrix with result history, test case definitions, coverage, bugs, accessibility,
// performance. Built by the Test Manager (Overview report button) and after every Playwright run: reports/index.html
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, REPORTS, projectSlugs, loadProject, isPseudoRun, isStatsRun, planProgress, sections, rel, fmtDate, pad } from './workspace.mjs';

const STATUSES = ['pass', 'flaky', 'fail', 'blocked', 'skipped'];
const STATUS_LABEL = { pass: 'Pass', flaky: 'Flaky', fail: 'Fail', blocked: 'Blocked', skipped: 'Skipped', never: 'Not run', untested: 'Untested' };

const RUNNER_LABEL = { playwright: 'Playwright', manual: 'Manual' };
const SEV_RANK = { critical: 0, major: 1, minor: 2, trivial: 3 };
const IMPACT_RANK = { critical: 0, serious: 1, moderate: 2, minor: 3 };
const PERF_LIMITS = { ttfbMs: 800, lcpMs: 2500, cls: 0.1, loadMs: 4000 };

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const anchor = (...parts) => parts.map((x) => String(x).replace(/[^A-Za-z0-9_-]+/g, '-')).join('--');
const when = (iso) => (iso ? fmtDate(new Date(iso)) : '-');
const shortWhen = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const dur = (ms) => {
  if (ms == null || Number.isNaN(ms)) return '-';
  const s = ms / 1000;
  return s < 60 ? `${s.toFixed(1)}s` : `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`;
};
const pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
const runMs = (r) => (r.finishedAt && r.startedAt ? new Date(r.finishedAt) - new Date(r.startedAt) : null);
const summaryOf = (r) => r.summary || { total: (r.tests || []).length };
const badge = (status, text) => `<span class="badge s-${esc(status)}">${esc(text ?? STATUS_LABEL[status] ?? status)}</span>`;
const reEsc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const stripId = (title, id) => String(title || '').replace(new RegExp('^\\s*' + reEsc(id) + '\\b[:\\s-]*'), '') || String(title || '');
const runnerTag = (runner) => `<span class="tag">${esc(RUNNER_LABEL[runner] || runner || 'unknown runner')}</span>`;

function verdict(s) {
  if (!s || !s.total) return { cls: 'skipped', text: 'Empty' };
  if (s.fail) return { cls: 'fail', text: `Fail (${s.fail} failed)` };
  if (s.blocked) return { cls: 'blocked', text: `Incomplete (${s.blocked} blocked)` };
  if (s.flaky) return { cls: 'flaky', text: `Pass (${s.flaky} flaky)` };
  if (s.pass) return { cls: 'pass', text: 'Pass' };
  return { cls: 'skipped', text: 'All skipped' };
}

function statusBar(s) {
  const total = (s && s.total) || 0;
  if (!total) return '<div class="bar"></div>';
  const label = STATUSES.map((k) => `${s[k] || 0} ${k}`).join(', ');
  return `<div class="bar" role="img" aria-label="${esc(label)}">${STATUSES.filter((k) => s[k])
    .map((k) => `<span class="c-${k}" style="width:${((100 * s[k]) / total).toFixed(2)}%" title="${s[k]} ${k}"></span>`).join('')}</div>`;
}

function counts(s) {
  return `<span class="counts">${STATUSES.filter((k) => s && s[k]).map((k) => `<span class="n-${k}">${s[k]} ${k}</span>`).join('')}</span>`;
}

// ------------------------------------------------------------------ images
function makeImager({ outDir, embed, budget }) {
  let used = 0;
  let embedded = 0;
  let linked = 0;
  const cache = new Map();
  const fn = (absPath, allowEmbed = true) => {
    const key = absPath + '|' + allowEmbed;
    if (cache.has(key)) return cache.get(key);
    let src = null;
    if (fs.existsSync(absPath)) {
      const size = fs.statSync(absPath).size;
      if (embed && allowEmbed && used + size <= budget) {
        const ext = path.extname(absPath).slice(1).toLowerCase();
        const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'webp' ? 'image/webp' : 'image/png';
        src = `data:${mime};base64,${fs.readFileSync(absPath).toString('base64')}`;
        used += size;
        embedded++;
      } else {
        src = path.relative(outDir, absPath).split(path.sep).join('/');
        linked++;
      }
    }
    cache.set(key, src);
    return src;
  };
  fn.stats = () => ({ embedded, linked, embeddedKB: Math.round(used / 1024) });
  fn.outDir = outDir;
  return fn;
}

// ------------------------------------------------------------------ mini markdown
function inline(s, image) {
  return s
    .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, alt, src) => (image ? image(src, alt) : `<span class="ref">${alt}</span>`))
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<span class="ref">$1</span>')
    .replace(/-&gt; Expect:/g, '<span class="expect">Expect:</span>');
}
function mdTable(rows, image) {
  const cells = (line) => line.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
  const body = rows.filter((r) => !/^\s*\|?\s*:?-{2,}/.test(r));
  if (!body.length) return '';
  const [head, ...rest] = body;
  return `<table class="md"><thead><tr>${cells(head).map((c) => `<th>${inline(esc(c), image)}</th>`).join('')}</tr></thead><tbody>${rest
    .map((r) => `<tr>${cells(r).map((c) => `<td>${inline(esc(c), image)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}
export function md(text, image) {
  const out = [];
  let list = null;
  let table = null;
  const closeList = () => { if (list) { out.push(`</${list}>`); list = null; } };
  const closeTable = () => { if (table) { out.push(mdTable(table, image)); table = null; } };
  for (const raw of String(text || '').replace(/\r/g, '').split('\n')) {
    const line = raw.trimEnd();
    if (/^\s*\|.*\|\s*$/.test(line)) { closeList(); (table = table || []).push(line); continue; }
    closeTable();
    let m;
    if ((m = /^\s*\d+\.\s+(.*)$/.exec(line))) {
      if (list !== 'ol') { closeList(); out.push('<ol>'); list = 'ol'; }
      out.push(`<li>${inline(esc(m[1]), image)}</li>`);
      continue;
    }
    if ((m = /^\s*[-*]\s+(?:\[[ xX]\]\s+)?(.*)$/.exec(line))) {
      if (list !== 'ul') { closeList(); out.push('<ul>'); list = 'ul'; }
      out.push(`<li>${inline(esc(m[1]), image)}</li>`);
      continue;
    }
    closeList();
    if (!line.trim()) continue;
    if ((m = /^#{1,6}\s+(.*)$/.exec(line))) { out.push(`<h4>${inline(esc(m[1]), image)}</h4>`); continue; }
    out.push(`<p>${inline(esc(line), image)}</p>`);
  }
  closeList();
  closeTable();
  return out.join('\n');
}

// ------------------------------------------------------------------ model
export function buildModel(p) {
  const cfg = p.cfg || {};
  const testRuns = p.runs.filter(isStatsRun);
  const specIndex = new Map();
  for (const s of p.specs) for (const id of s.ids) specIndex.set(id, rel(s.file));
  const hist = new Map();
  for (const r of testRuns) {
    for (const t of r.tests || []) {
      if (t.status === 'untested') continue;
      if (!hist.has(t.id)) hist.set(t.id, []);
      hist.get(t.id).push({ run: r, t });
    }
  }
  const bugs = p.bugs.filter((b) => b.fm && b.fm.id).map((b) => ({ ...b.fm, file: b.file, body: b.body }))
    .sort((a, b) => (SEV_RANK[a.severity] ?? 9) - (SEV_RANK[b.severity] ?? 9) || String(a.id).localeCompare(String(b.id)));
  const bugsByTest = new Map();
  const linkBug = (testId, bugId) => {
    if (!bugsByTest.has(testId)) bugsByTest.set(testId, new Set());
    bugsByTest.get(testId).add(bugId);
  };
  for (const b of bugs) for (const id of b.tests || []) linkBug(id, b.id);
  for (const r of p.runs) for (const t of r.tests || []) if (t.bug) linkBug(t.id, t.bug);
  const tests = p.tests.filter((t) => t.fm && t.fm.id).map((t) => {
    const h = hist.get(t.fm.id) || [];
    const last = h[h.length - 1] || null;
    const recent = h.slice(-10).map((x) => x.t.status);
    return {
      ...t.fm, file: rel(t.file), sec: sections(t.body), spec: specIndex.get(t.fm.id) || null, history: h, last,
      lastStatus: last ? last.t.status : 'never',
      flaky: recent.includes('flaky') || (recent.includes('pass') && recent.includes('fail')),
      lastMs: last ? last.t.durationMs : null,
      bugs: [...(bugsByTest.get(t.fm.id) || [])],
    };
  }).sort((a, b) => String(a.id).localeCompare(String(b.id), undefined, { numeric: true }));

  const recentRuns = testRuns.slice(-10);
  const counted = recentRuns.flatMap((r) => r.tests || []).filter((t) => t.status !== 'skipped');
  const passRate = counted.length ? pct(counted.filter((t) => t.status === 'pass' || t.status === 'flaky').length, counted.length) : null;
  const openBugs = bugs.filter((b) => ['open', 'fixed'].includes(b.status));

  // accessibility and performance: latest entry per page (+ rule)
  const a11y = new Map();
  const perf = new Map();
  for (const r of p.runs) {
    for (const t of r.tests || []) {
      for (const a of t.a11y || []) {
        for (const v of a.violations || []) a11y.set(`${a.url}|${v.id}`, { ...v, url: a.url, run: r, test: t.id });
      }
      for (const m of t.perf || []) perf.set(m.url, { ...m, run: r, test: t.id });
    }
  }
  const a11yList = [...a11y.values()].sort((x, y) => (IMPACT_RANK[x.impact] ?? 9) - (IMPACT_RANK[y.impact] ?? 9) || y.count - x.count);
  const perfList = [...perf.values()];

  const plans = p.plans.map((pl) => ({ ...pl, progress: planProgress(pl, p) }));
  const model = {
    slug: p.slug, cfg, name: cfg.name || p.slug, runs: p.runs, testRuns, tests, bugs, openBugs, a11yList, perfList, plans,
    specs: p.specs, passRate,
    automated: tests.filter((t) => t.spec).length,
    failing: tests.filter((t) => t.lastStatus === 'fail'),
    flaky: tests.filter((t) => t.flaky),
    never: tests.filter((t) => t.lastStatus === 'never'),
    lastRun: testRuns[testRuns.length - 1] || null,
  };
  model.insights = insights(model);
  return model;
}

function insights(m) {
  const out = [];
  const add = (level, html) => out.push({ level, html });
  const ids = (list) => list.slice(0, 15).map((t) => `<a href="#${anchor('tc', m.slug, t.id)}">${esc(t.id)}</a>`).join(', ') + (list.length > 15 ? ` and ${list.length - 15} more` : '');
  if (m.lastRun) {
    const s = summaryOf(m.lastRun);
    const v = verdict(s);
    add(v.cls === 'pass' ? 'good' : v.cls === 'flaky' ? 'warn' : 'bad',
      `Last test run <a href="#${anchor('run', m.slug, m.lastRun.runId)}">${esc(m.lastRun.runId)}</a> (${esc(RUNNER_LABEL[m.lastRun.runner] || m.lastRun.runner)}): <strong>${esc(v.text)}</strong>, ${s.pass || 0} of ${s.total} passed in ${dur(runMs(m.lastRun))}.`);
  } else add('warn', 'No test runs yet. Run the smoke suite from the Test Manager or with npm run test:smoke.');
  if (m.failing.length) add('bad', `Failing now: ${ids(m.failing)}.`);
  const untriaged = m.runs.flatMap((r) => r.tests || []).filter((t) => t.status === 'fail' && (!t.failureType || t.failureType === 'untriaged'));
  if (untriaged.length) add('warn', `${plural(untriaged.length, 'failure')} not triaged yet (product bug, test issue, or environment).`);
  if (m.flaky.length) add('warn', `Flaky in the last 10 runs: ${ids(m.flaky)}. Fix the cause before trusting these results.`);
  else if (m.testRuns.length) add('good', 'No flaky tests in the last 10 runs.');
  if (m.never.length) add('warn', `Never run: ${ids(m.never)}.`);
  const stale = m.tests.filter((t) => t.last && Date.now() - new Date(t.last.run.startedAt).getTime() > 14 * 864e5);
  if (stale.length) add('warn', `Not run in 14+ days: ${ids(stale)}.`);
  const manualCritical = m.tests.filter((t) => !t.spec && ['P0', 'P1'].includes(t.priority));
  if (m.tests.length) {
    add(manualCritical.length ? 'info' : 'good', `Automation coverage: ${m.automated} of ${m.tests.length} tests are automated with a Playwright test (${pct(m.automated, m.tests.length)}%).${manualCritical.length ? ` P0/P1 tests to automate next: ${ids(manualCritical)}.` : ''}`);
  }
  if (m.openBugs.length) {
    const bySev = Object.entries(m.openBugs.reduce((a, b) => ((a[b.severity] = (a[b.severity] || 0) + 1), a), {}))
      .sort((a, b) => (SEV_RANK[a[0]] ?? 9) - (SEV_RANK[b[0]] ?? 9)).map(([k, n]) => `${n} ${k}`).join(', ');
    add(m.openBugs.some((b) => ['critical', 'major'].includes(b.severity)) ? 'bad' : 'warn', `Open bugs: ${bySev}. See <a href="#${anchor('bugs', m.slug)}">Bugs</a>.`);
  } else add('good', 'No open bugs.');
  const lastTests = m.lastRun ? (m.lastRun.tests || []).filter((t) => t.durationMs > 0) : [];
  if (lastTests.length > 1) {
    const slow = lastTests.slice().sort((a, b) => b.durationMs - a.durationMs)[0];
    const total = lastTests.reduce((a, t) => a + t.durationMs, 0);
    add('info', `Slowest test in the last run: <a href="#${anchor('tc', m.slug, slow.id)}">${esc(slow.id)}</a> (${dur(slow.durationMs)} of ${dur(total)} total test time).`);
  }
  if (m.a11yList.length) {
    const top = m.a11yList[0];
    add(['critical', 'serious'].includes(top.impact) ? 'warn' : 'info', `Accessibility: ${plural(m.a11yList.length, 'rule')} violated. Top: <code>${esc(top.id)}</code> (${esc(top.impact)}, ${plural(top.count, 'element')}).`);
  }
  const slowPages = m.perfList.filter((x) => (x.ttfbMs ?? 0) > PERF_LIMITS.ttfbMs || (x.lcpMs ?? 0) > PERF_LIMITS.lcpMs || (x.cls ?? 0) > PERF_LIMITS.cls || (x.loadMs ?? 0) > PERF_LIMITS.loadMs);
  if (m.perfList.length) add(slowPages.length ? 'warn' : 'good', slowPages.length ? `Performance: ${plural(slowPages.length, 'page')} over budget (TTFB 800ms, LCP 2.5s, CLS 0.1, load 4s).` : `Performance: ${plural(m.perfList.length, 'measured page')} within budget.`);
  return out;
}

// ------------------------------------------------------------------ render pieces
const kpi = (label, value, sub, cls = '') => `<div class="kpi ${cls}"><div class="l">${esc(label)}</div><div class="v">${value}</div>${sub ? `<div class="s">${sub}</div>` : ''}</div>`;

function historyChart(m) {
  const runs = m.testRuns.slice(-20);
  if (!runs.length) return '<p class="muted">No test runs yet.</p>';
  const W = 1200;
  const H = 200;
  const L = 34;
  const B = 46;
  const T = 12;
  const max = Math.max(1, ...runs.map((r) => summaryOf(r).total || 0));
  const step = Math.min(110, (W - L - 10) / runs.length);
  const bw = Math.max(10, Math.min(46, step * 0.55));
  const y = (n) => H - B - (n / max) * (H - B - T);
  let g = '';
  for (const v of [0, Math.round(max / 2), max]) g += `<line x1="${L}" x2="${W - 6}" y1="${y(v)}" y2="${y(v)}" class="grid"/><text x="${L - 6}" y="${y(v) + 4}" class="ax" text-anchor="end">${v}</text>`;
  runs.forEach((r, i) => {
    const s = summaryOf(r);
    const x = L + 10 + i * step + (step - bw) / 2;
    let acc = 0;
    g += `<a href="#${anchor('run', m.slug, r.runId)}"><title>${esc(`${r.runId}: ${STATUSES.map((k) => `${s[k] || 0} ${k}`).join(', ')}`)}</title>`;
    for (const k of STATUSES) {
      const n = s[k] || 0;
      if (!n) continue;
      g += `<rect x="${x.toFixed(1)}" y="${y(acc + n).toFixed(1)}" width="${bw.toFixed(1)}" height="${(y(acc) - y(acc + n)).toFixed(1)}" class="c-${k}"/>`;
      acc += n;
    }
    g += '</a>';
    g += `<text x="${(x + bw / 2).toFixed(1)}" y="${H - B + 16}" class="ax" text-anchor="middle">${esc(shortWhen(r.startedAt))}</text>`;
    g += `<text x="${(x + bw / 2).toFixed(1)}" y="${H - B + 30}" class="ax2" text-anchor="middle">${esc(r.suite || '')}</text>`;
  });
  const legend = STATUSES.map((k) => `<span><i class="c-${k}"></i>${STATUS_LABEL[k]}</span>`).join('');
  return `<figure class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Results per test run, oldest to newest">${g}</svg><figcaption class="legend">${legend}<span class="muted">Click a bar to open the run. Scan runs (baseline, explore) are not charted.</span></figcaption></figure>`;
}

function checksList(checks) {
  if (!checks || !checks.length) return '<p class="muted">No checks recorded.</p>';
  return `<ul class="checks">${checks.map((c) => `<li class="${c.pass ? 'ok' : 'ko'}"><span class="mark">${c.pass ? 'PASS' : 'FAIL'}</span> <span>${inline(esc(c.label))}</span>${c.actual ? `<div class="actual">actual: <code>${esc(c.actual)}</code></div>` : ''}</li>`).join('')}</ul>`;
}

function issuesBlock(iss) {
  if (!iss || !iss.total) return '';
  const rows = [
    ...(iss.pageErrors || []).map((x) => ['JS error', x]),
    ...(iss.consoleErrors || []).map((x) => ['console.error', x]),
    ...(iss.failedRequests || []).map((x) => ['Request', x]),
  ];
  return `<h5>Console and network issues</h5><table class="mini"><tbody>${rows.map(([k, v]) => `<tr><th>${esc(k)}</th><td><code>${esc(v)}</code></td></tr>`).join('')}</tbody></table>`;
}

function a11yTable(list, withPage = true) {
  return `<table class="mini"><thead><tr><th>Rule</th><th>Impact</th><th>Elements</th>${withPage ? '<th>Page</th>' : ''}<th>Examples</th></tr></thead><tbody>${list
    .map((v) => `<tr><td><a href="${esc(v.helpUrl)}" target="_blank" rel="noopener"><code>${esc(v.id)}</code></a><div class="muted">${esc(v.help)}</div></td><td>${badge(v.impact === 'critical' || v.impact === 'serious' ? 'fail' : 'flaky', v.impact)}</td><td>${v.count}</td>${withPage ? `<td>${esc(v.url)}</td>` : ''}<td>${(v.targets || []).map((t) => `<code>${esc(t)}</code>`).join(' ')}</td></tr>`).join('')}</tbody></table>`;
}

function perfCells(x) {
  const ms = (v, lim) => (v == null ? '<span class="muted">n/a</span>' : `<span class="${lim && v > lim ? 'over' : ''}">${v} ms</span>`);
  return `<td>${ms(x.ttfbMs, PERF_LIMITS.ttfbMs)}</td><td>${ms(x.domContentLoadedMs)}</td><td>${ms(x.loadMs, PERF_LIMITS.loadMs)}</td><td>${ms(x.lcpMs, PERF_LIMITS.lcpMs)}</td><td><span class="${(x.cls ?? 0) > PERF_LIMITS.cls ? 'over' : ''}">${x.cls ?? 'n/a'}</span></td><td>${x.resources ?? '-'} (${x.resourcesKB ?? 0} KB)</td>`;
}

function shots(r, t, img, allowEmbed) {
  const list = [...(t.history || []).flatMap((h) => (h.evidence || []).map((e) => ({ e, note: `earlier attempt (${h.status})` }))), ...(t.evidence || []).map((e) => ({ e, note: '' }))]
    .filter((x) => /\.(png|jpe?g|webp)$/i.test(x.e));
  const traces = (t.evidence || []).filter((e) => /\.zip$/i.test(e));
  if (!list.length && !traces.length) return '';
  const figs = list.map(({ e, note }) => {
    const src = img(path.join(r.dir, e), allowEmbed);
    if (!src) return `<figure><div class="missing">missing: ${esc(e)}</div></figure>`;
    return `<figure><img class="zoom" decoding="async" src="${src}" alt="${esc(`${t.id} ${path.basename(e)}`)}"><figcaption>${esc(path.basename(e))}${note ? ` <span class="muted">${esc(note)}</span>` : ''}</figcaption></figure>`;
  }).join('');
  const tr = traces.map((e) => `<li>Playwright trace: <code>${esc(rel(path.join(r.dir, e)))}</code> (open with <code>npx playwright show-trace</code>)</li>`).join('');
  return `<h5>Evidence</h5><div class="shots">${figs}</div>${tr ? `<ul>${tr}</ul>` : ''}`;
}

function runTestDetails(m, r, t, img, allowEmbed) {
  const checks = t.checks || [];
  const passed = checks.filter((c) => c.pass).length;
  const open = ['fail', 'flaky', 'blocked'].includes(t.status) ? ' open' : '';
  const isKnown = m.tests.some((x) => x.id === t.id);
  const facts = [
    t.failureType && t.status === 'fail' ? `<li>Failure type: <strong>${esc(t.failureType)}</strong></li>` : '',
    t.bug ? `<li>Bug: <a href="#${anchor('bug', m.slug, t.bug)}">${esc(t.bug)}</a></li>` : '',
    t.url ? `<li>URL: <code>${esc(t.url)}</code></li>` : '',
    t.file ? `<li>Source: <code>${esc(t.file)}</code></li>` : '',
    t.attempts > 1 ? `<li>Attempts: ${t.attempts}</li>` : '',
    isKnown ? `<li><a href="#${anchor('tc', m.slug, t.id)}">Test case definition and history</a></li>` : '',
    ...(t.history || []).map((h) => `<li>Earlier attempt: ${badge(h.status)}${h.failed && h.failed.length ? ` failed: ${esc(h.failed.join('; '))}` : ''}${h.error ? ` <code>${esc(String(h.error).slice(0, 200))}</code>` : ''}</li>`),
    ...(t.notes || []).map((n) => `<li>Note: ${esc(n)}</li>`),
  ].filter(Boolean).join('');
  const perfRows = (t.perf || []).map((x) => `<tr><td>${esc(x.url)}</td>${perfCells(x)}</tr>`).join('');
  return `<details class="sub" id="${anchor('rt', m.slug, r.runId, t.id)}"${open}>
<summary>${badge(t.status)} <strong>${esc(t.id)}</strong> <span class="ttl">${esc(stripId(t.title, t.id))}</span><span class="right">${checks.length ? `${passed}/${checks.length} checks` : ''} <span class="muted">${dur(t.durationMs)}</span></span></summary>
<div class="sub-body">
${facts ? `<ul class="facts">${facts}</ul>` : ''}
${t.error ? `<h5>Error</h5><pre>${esc(t.error)}</pre>` : ''}
<h5>Checks</h5>${checksList(checks)}
${issuesBlock(t.issues)}
${(t.a11y || []).map((a) => `<h5>Accessibility scan: ${esc(a.url)}</h5>${a.violations.length ? a11yTable(a.violations.map((v) => ({ ...v, url: a.url })), false) : '<p class="good-text">No violations.</p>'}`).join('')}
${perfRows ? `<h5>Performance</h5><table class="mini"><thead><tr><th>Page</th><th>TTFB</th><th>DOM ready</th><th>Load</th><th>LCP</th><th>CLS</th><th>Resources</th></tr></thead><tbody>${perfRows}</tbody></table>` : ''}
${shots(r, t, img, allowEmbed)}
</div></details>`;
}

function runCard(m, r, img, idx) {
  const s = summaryOf(r);
  const v = verdict(s);
  const scan = isPseudoRun(r);
  const live = !!r.inProgress;
  const allowEmbed = idx < 10;
  const tests = (r.tests || []).slice().sort((a, b) => String(a.id).localeCompare(String(b.id), undefined, { numeric: true }));
  const allChecks = tests.flatMap((t) => t.checks || []);
  const checksTxt = allChecks.length ? `<span class="muted">${allChecks.filter((c) => c.pass).length}/${allChecks.length} checks</span>` : '';
  const open = m.lastRun ? r === m.lastRun : idx === 0;
  return `<details class="card run" id="${anchor('run', m.slug, r.runId)}"${open ? ' open' : ''}>
<summary>${live ? badge('untested', 'In progress') : badge(v.cls, v.text)} <strong>${esc(r.suite || 'run')}</strong> ${scan ? '<span class="tag">scan</span>' : ''} ${r.plan ? `<span class="tag">${esc(r.plan)}</span>` : ''} ${runnerTag(r.runner)} <span class="muted">${esc(when(r.startedAt))} · ${esc(r.env || '')} · ${dur(runMs(r))}</span><span class="right">${checksTxt}${counts(s)}</span>${statusBar(s)}</summary>
<div class="card-body">
<table class="kv"><tbody>
<tr><th>Run</th><td><code>${esc(r.runId)}</code></td><th>Runner</th><td>${esc(RUNNER_LABEL[r.runner] || r.runner)}${r.workers && r.workers.length > 1 ? ` (${r.workers.length} workers)` : ''}</td></tr>
<tr><th>Base URL</th><td><a href="${esc(r.baseUrl)}" target="_blank" rel="noopener">${esc(r.baseUrl)}</a></td><th>Environment</th><td>${esc(r.env)}</td></tr>
<tr><th>Started</th><td>${esc(when(r.startedAt))}</td><th>Finished</th><td>${esc(when(r.finishedAt))} (${dur(runMs(r))})</td></tr>
<tr><th>Folder</th><td colspan="3"><code>${esc(rel(r.dir))}</code>${fs.existsSync(path.join(r.dir, 'report.html')) ? ` <a href="${esc(path.relative(img.outDir, path.join(r.dir, 'report.html')).split(path.sep).join('/'))}" target="_blank" rel="noopener">Open this run's test report</a>` : ''}</td></tr>
</tbody></table>
${r.notes ? `<p class="note">${esc(r.notes)}</p>` : ''}
${tests.filter((t) => PROBLEM.includes(t.status)).map((t) => runTestDetails(m, r, t, img, allowEmbed)).join('\n')}
${compactRows(m, r, tests.filter((t) => !PROBLEM.includes(t.status)))}
</div></details>`;
}

function historyDots(m, t) {
  const h = t.history.slice(-10);
  if (!h.length) return '<span class="muted">-</span>';
  return `<span class="dots">${h.map((x) => `<a class="dot c-${esc(x.t.status)}" href="#${anchor('rt', m.slug, x.run.runId, t.id)}" title="${esc(`${shortWhen(x.run.startedAt)} ${RUNNER_LABEL[x.run.runner] || x.run.runner}: ${x.t.status}, ${dur(x.t.durationMs)}`)}"></a>`).join('')}</span>`;
}

function testMatrix(m) {
  const tid = anchor('matrix', m.slug);
  const prios = [...new Set(m.tests.map((t) => t.priority).filter(Boolean))].sort();
  const statusChips = ['all', 'pass', 'fail', 'flaky', 'blocked', 'skipped', 'never']
    .filter((k) => k === 'all' || m.tests.some((t) => t.lastStatus === k))
    .map((k) => `<button type="button" class="chip" data-status="${k}" aria-pressed="${k === 'all'}">${k === 'all' ? 'All' : STATUS_LABEL[k]} (${k === 'all' ? m.tests.length : m.tests.filter((t) => t.lastStatus === k).length})</button>`).join('');
  return `<div class="filters" data-filter-for="${tid}">${statusChips}
<select aria-label="Priority"><option value="all">All priorities</option>${prios.map((x) => `<option value="${esc(x)}">${esc(x)}</option>`).join('')}</select>
<input type="search" placeholder="Search ID, title, tag, feature" aria-label="Search tests"></div>
<table class="matrix" id="${tid}"><thead><tr><th>ID</th><th>Test</th><th>Priority</th><th>Tags</th><th>Type</th><th>Last result</th><th>History (old to new)</th><th>Last time</th><th>Bugs</th></tr></thead><tbody>
${m.tests.map((t) => `<tr data-status="${esc(t.lastStatus)}" data-priority="${esc(t.priority)}">
<td><a href="#${anchor('tc', m.slug, t.id)}"><strong>${esc(t.id)}</strong></a></td>
<td>${esc(t.title)}<div class="muted">${esc(t.feature || '')}</div></td>
<td><span class="prio p-${esc(t.priority)}">${esc(t.priority || '-')}</span></td>
<td>${(t.tags || []).map((x) => `<span class="tag">${esc(x)}</span>`).join(' ')}</td>
<td>${t.spec ? '<span class="tag auto">Automated</span>' : '<span class="tag">Manual</span>'}</td>
<td>${badge(t.lastStatus)}${t.last ? `<div class="muted">${esc(shortWhen(t.last.run.startedAt))}</div>` : ''}</td>
<td>${historyDots(m, t)}</td>
<td>${dur(t.lastMs)}${t.last ? `<div class="muted small">${esc(RUNNER_LABEL[t.last.run.runner] || t.last.run.runner)}</div>` : ''}</td>
<td>${t.bugs.map((b) => `<a href="#${anchor('bug', m.slug, b)}">${esc(b)}</a>`).join(' ') || '<span class="muted">-</span>'}</td>
</tr>`).join('\n')}
</tbody></table>`;
}

function testCard(m, t) {
  const sec = t.sec;
  const part = (title, key) => (sec[key] ? `<h5>${title}</h5>${md(sec[key])}` : '');
  const last = t.last;
  const histRows = t.history.slice(-5).reverse().map((x) => `<tr><td><a href="#${anchor('rt', m.slug, x.run.runId, t.id)}"><code class="rid">${esc(x.run.runId)}</code></a></td><td>${esc(RUNNER_LABEL[x.run.runner] || x.run.runner)}</td><td>${badge(x.t.status)}</td><td>${(x.t.checks || []).filter((c) => c.pass).length}/${(x.t.checks || []).length}</td><td>${dur(x.t.durationMs)}</td></tr>`).join('');
  return `<details class="card tc" id="${anchor('tc', m.slug, t.id)}">
<summary>${badge(t.lastStatus)} <strong>${esc(t.id)}</strong> <span class="ttl">${esc(t.title)}</span><span class="right"><span class="prio p-${esc(t.priority)}">${esc(t.priority || '-')}</span> ${t.spec ? '<span class="tag auto">Automated</span>' : '<span class="tag">Manual</span>'}</span></summary>
<div class="card-body two">
<div>
${part('Goal', 'goal')}${part('Preconditions', 'preconditions')}${part('Data', 'data')}${part('Steps', 'steps')}${part('Expected', 'expected')}${part('Notes', 'notes')}
</div>
<div>
<table class="kv"><tbody>
<tr><th>Feature</th><td>${esc(t.feature || '-')}</td></tr>
<tr><th>Tags</th><td>${(t.tags || []).map((x) => `<span class="tag">${esc(x)}</span>`).join(' ') || '-'}</td></tr>
<tr><th>Test file</th><td><code>${esc(t.file)}</code></td></tr>
<tr><th>Spec</th><td>${t.spec ? `<code>${esc(t.spec)}</code>` : '<span class="muted">no Playwright spec</span>'}</td></tr>
<tr><th>Updated</th><td>${esc(t.updated || t.created || '-')}</td></tr>
<tr><th>Bugs</th><td>${t.bugs.map((b) => `<a href="#${anchor('bug', m.slug, b)}">${esc(b)}</a>`).join(' ') || '-'}</td></tr>
</tbody></table>
${last ? `<h5>Latest result</h5><p>${badge(last.t.status)} <a href="#${anchor('rt', m.slug, last.run.runId, t.id)}"><code class="rid">${esc(last.run.runId)}</code></a> <span class="muted">${esc(RUNNER_LABEL[last.run.runner] || last.run.runner)}, ${dur(last.t.durationMs)}</span></p>${checksList(last.t.checks)}` : '<h5>Latest result</h5><p class="muted">Not run yet.</p>'}
${histRows ? `<h5>History${t.history.length > 5 ? ` (latest 5 of ${t.history.length})` : ''}</h5><table class="mini"><thead><tr><th>Run</th><th>Runner</th><th>Status</th><th>Checks</th><th>Time</th></tr></thead><tbody>${histRows}</tbody></table>` : ''}
</div>
</div></details>`;
}

function coverage(m) {
  const feats = new Map();
  for (const t of m.tests) {
    const f = t.feature || '(none)';
    if (!feats.has(f)) feats.set(f, { n: 0, auto: 0, P0: 0, P1: 0, P2: 0, P3: 0, pass: 0, fail: 0, never: 0 });
    const x = feats.get(f);
    x.n++;
    if (t.spec) x.auto++;
    if (x[t.priority] !== undefined) x[t.priority]++;
    if (t.lastStatus === 'never') x.never++;
    else if (t.lastStatus === 'fail') x.fail++;
    else if (t.lastStatus === 'pass' || t.lastStatus === 'flaky') x.pass++;
  }
  const suites = Object.entries(m.cfg.suites || {}).map(([name, s]) => {
    const tags = s.tags || [];
    const n = m.tests.filter((t) => (t.tags || []).some((x) => tags.includes(x))).length;
    return `<tr><td><strong>${esc(name)}</strong></td><td>${tags.map((x) => `<span class="tag">${esc(x)}</span>`).join(' ')}</td><td>${n}</td><td class="muted">${esc(s.description || '')}</td></tr>`;
  }).join('');
  return `<div class="grid2"><div><h4>By feature</h4><table class="mini"><thead><tr><th>Feature</th><th>Tests</th><th>Automated</th><th>P0</th><th>P1</th><th>P2</th><th>P3</th><th>Last pass</th><th>Last fail</th><th>Not run</th></tr></thead><tbody>${[...feats]
    .sort().map(([f, x]) => `<tr><td>${esc(f)}</td><td>${x.n}</td><td><div class="meter" title="${x.auto}/${x.n}"><span style="width:${pct(x.auto, x.n)}%"></span></div>${x.auto}/${x.n}</td><td>${x.P0}</td><td>${x.P1}</td><td>${x.P2}</td><td>${x.P3}</td><td>${x.pass}</td><td>${x.fail}</td><td>${x.never}</td></tr>`).join('')}</tbody></table></div>
<div><h4>Suites</h4><table class="mini"><thead><tr><th>Suite</th><th>Tags</th><th>Tests</th><th>Purpose</th></tr></thead><tbody>${suites || '<tr><td colspan="4" class="muted">No suites defined.</td></tr>'}</tbody></table></div></div>`;
}

// Full details only for the latest runs keep this overview small; every run has its own report.html.
const DETAILED_RUNS = 20;
const PROBLEM = ['fail', 'flaky', 'blocked'];
// Passing and skipped results as one compact table; their full detail lives in the run's own report.
function compactRows(m, r, tests) {
  if (!tests.length) return '';
  const rows = tests.map((t) => {
    const checks = t.checks || [];
    return `<tr id="${anchor('rt', m.slug, r.runId, t.id)}"><td>${badge(t.status)}</td><td><strong>${esc(t.id)}</strong> ${esc(stripId(t.title, t.id))}</td><td>${checks.length ? `${checks.filter((c) => c.pass).length}/${checks.length}` : '-'}</td><td>${dur(t.durationMs)}</td></tr>`;
  }).join('');
  return `<table class="mini"><thead><tr><th>Result</th><th>Test</th><th>Checks</th><th>Time</th></tr></thead><tbody>${rows}</tbody></table>`;
}
function olderRuns(m, runs, img) {
  if (!runs.length) return '';
  const rows = runs.map((r) => {
    const s = summaryOf(r);
    const v = verdict(s);
    const report = path.join(r.dir, 'report.html');
    const link = fs.existsSync(report) ? `<a href="${esc(path.relative(img.outDir, report).split(path.sep).join('/'))}" target="_blank" rel="noopener">Test report</a>` : '<span class="muted">no report yet</span>';
    return `<tr id="${anchor('run', m.slug, r.runId)}"><td>${badge(v.cls, v.text)}</td><td><code>${esc(r.runId)}</code></td><td>${esc(RUNNER_LABEL[r.runner] || r.runner)}</td><td>${esc(when(r.startedAt))}</td><td>${statusBar(s)}</td><td>${link}</td></tr>`;
  }).join('');
  return `<details class="card"><summary><strong>Older runs (${runs.length})</strong> <span class="muted">summary only; open each run's own test report for details</span></summary><div class="card-body"><table class="mini"><thead><tr><th>Result</th><th>Run</th><th>Runner</th><th>Started</th><th>Results</th><th></th></tr></thead><tbody>${rows}</tbody></table></div></details>`;
}

function plansSection(m) {
  if (!m.plans.length) return '';
  const rows = m.plans.map((pl) => {
    const c = pl.progress.counts;
    const done = c.total ? Math.round((100 * (c.total - c.untested)) / c.total) : 0;
    const so = (pl.signoff && pl.signoff.status) || 'pending';
    return `<tr><td><strong>${esc(pl.id)}</strong><div>${esc(pl.name || '')}</div></td><td>${esc(pl.release || '-')}</td><td>${esc(pl.env || '-')}</td><td>${esc(pl.status || 'draft')}</td>`
      + `<td>${statusBar({ ...c, total: c.total })}<div class="muted small">${done}% executed: ${c.pass} pass, ${c.fail} fail, ${c.blocked} blocked, ${c.untested} untested</div></td>`
      + `<td>${pl.progress.ready ? badge('pass', 'Ready') : badge(c.fail || c.blocked ? 'fail' : 'untested', c.fail || c.blocked ? 'Blocked' : 'Not ready')}</td><td>${esc(so)}${pl.signoff && pl.signoff.by ? ` <span class="muted">by ${esc(pl.signoff.by)}</span>` : ''}</td><td>${esc(pl.due || '-')}</td></tr>`;
  }).join('');
  return `<h3 id="${anchor('plans', m.slug)}">Test plans</h3><table class="mini"><thead><tr><th>Plan</th><th>Release</th><th>Env</th><th>Status</th><th>Progress</th><th>Readiness</th><th>Sign-off</th><th>Due</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function bugsSection(m, img) {
  if (!m.bugs.length) return '<p class="muted">No bugs filed.</p>';
  const rows = m.bugs.map((b) => `<tr><td><a href="#${anchor('bug', m.slug, b.id)}"><strong>${esc(b.id)}</strong></a></td><td><span class="sev sev-${esc(b.severity)}">${esc(b.severity)}</span></td><td>${esc(b.status)}</td><td>${esc(b.title)}</td><td>${esc(b.env || '-')}</td><td>${esc(b.found || '-')}</td><td>${(b.tests || []).map((x) => `<a href="#${anchor('tc', m.slug, x)}">${esc(x)}</a>`).join(' ') || '-'}</td></tr>`).join('');
  const cards = m.bugs.map((b) => {
    const bugDir = path.dirname(b.file);
    const image = (src, alt) => {
      const abs = path.resolve(bugDir, src);
      const s = img(abs, true);
      return s ? `<img class="zoom inline" src="${s}" alt="${alt}">` : `<span class="ref">${alt}</span>`;
    };
    return `<details class="card" id="${anchor('bug', m.slug, b.id)}"><summary><span class="sev sev-${esc(b.severity)}">${esc(b.severity)}</span> <strong>${esc(b.id)}</strong> <span class="ttl">${esc(b.title)}</span><span class="right">${esc(b.status)}</span></summary>
<div class="card-body">
<table class="kv"><tbody><tr><th>Status</th><td>${esc(b.status)}</td><th>Found</th><td>${esc(b.found || '-')} ${b.foundBy ? `<span class="muted">(${esc(b.foundBy)})</span>` : ''}</td></tr>
<tr><th>Environment</th><td>${esc(b.env || '-')}</td><th>Frequency</th><td>${esc(b.frequency || '-')}</td></tr>
<tr><th>URL</th><td colspan="3">${b.url ? `<a href="${esc(b.url)}" target="_blank" rel="noopener">${esc(b.url)}</a>` : '-'}</td></tr>
<tr><th>File</th><td colspan="3"><code>${esc(rel(b.file))}</code></td></tr></tbody></table>
<div class="md-body">${md(b.body, image)}</div>
</div></details>`;
  }).join('\n');
  return `<table class="mini"><thead><tr><th>ID</th><th>Severity</th><th>Status</th><th>Title</th><th>Env</th><th>Found</th><th>Tests</th></tr></thead><tbody>${rows}</tbody></table>${cards}`;
}

function qualitySection(m) {
  const a = m.a11yList.length
    ? a11yTable(m.a11yList)
    : '<p class="muted">No accessibility scans recorded yet.</p>';
  const p = m.perfList.length
    ? `<table class="mini"><thead><tr><th>Page</th><th>TTFB</th><th>DOM ready</th><th>Load</th><th>LCP</th><th>CLS</th><th>Resources</th><th>Run</th></tr></thead><tbody>${m.perfList
      .map((x) => `<tr><td>${esc(x.url)}</td>${perfCells(x)}<td><a href="#${anchor('run', m.slug, x.run.runId)}"><code class="rid">${esc(x.run.runId)}</code></a></td></tr>`).join('')}</tbody></table><p class="muted small">Budgets: TTFB 800 ms, load 4 s, LCP 2.5 s, CLS 0.1. Values over budget are red. LCP is n/a when the page loaded in a background tab.</p>`
    : '<p class="muted">No performance measurements recorded yet.</p>';
  return `<h4>Accessibility (axe-core, WCAG 2.1 A/AA)</h4>${a}<h4>Performance</h4>${p}`;
}

function projectSection(m, img) {
  const envs = Object.entries(m.cfg.envs || {}).map(([k, v]) => `<span class="env"><strong>${esc(k)}</strong>${k === m.cfg.defaultEnv ? ' (default)' : ''}: <a href="${esc(v.baseUrl)}" target="_blank" rel="noopener">${esc(v.baseUrl)}</a>${v.allowWrites ? '' : ' <span class="tag">read-only</span>'}</span>`).join('');
  const s = m.lastRun ? summaryOf(m.lastRun) : null;
  const v = s ? verdict(s) : null;
  const runsDesc = m.runs.slice().reverse();
  return `<section class="project" id="${anchor('p', m.slug)}">
<h2>${esc(m.name)} <span class="slug">${esc(m.slug)}</span></h2>
${m.cfg.description ? `<p class="desc">${esc(m.cfg.description)}</p>` : ''}
<div class="envs">${envs}</div>
<div class="kpis">
${kpi('Last run', v ? badge(v.cls, v.text) : '<span class="muted">none</span>', m.lastRun ? esc(when(m.lastRun.startedAt)) : '')}
${kpi('Pass rate', m.passRate == null ? '-' : `${m.passRate}%`, 'last 10 test runs', m.passRate == null ? '' : m.passRate >= 95 ? 'good' : m.passRate >= 80 ? 'warn' : 'bad')}
${kpi('Test cases', m.tests.length, `${m.tests.filter((t) => ['P0', 'P1'].includes(t.priority)).length} are P0/P1`)}
${kpi('Automated', `${pct(m.automated, m.tests.length)}%`, `${m.automated} of ${m.tests.length} have a Playwright test`)}
${kpi('Failing now', m.failing.length, '', m.failing.length ? 'bad' : 'good')}
${kpi('Flaky', m.flaky.length, 'last 10 runs', m.flaky.length ? 'warn' : 'good')}
${kpi('Open bugs', m.openBugs.length, m.openBugs.length ? m.openBugs.map((b) => b.severity).join(', ') : '', m.openBugs.length ? 'warn' : 'good')}
${kpi('Runs', m.runs.length, `${m.testRuns.length} test, ${m.runs.length - m.testRuns.length} scan`)}
</div>
<h3>Insights</h3>
<ul class="insights">${m.insights.map((i) => `<li class="${i.level}">${i.html}</li>`).join('')}</ul>
<h3>Run history</h3>
${historyChart(m)}
<h3 id="${anchor('runs', m.slug)}">Runs <button type="button" class="mini-btn" data-toggle="${anchor('runs', m.slug, 'list')}">Expand all</button></h3>
<div id="${anchor('runs', m.slug, 'list')}">${runsDesc.slice(0, DETAILED_RUNS).map((r, i) => runCard(m, r, img, i)).join('\n') || '<p class="muted">No runs yet.</p>'}</div>
${olderRuns(m, runsDesc.slice(DETAILED_RUNS), img)}
<h3 id="${anchor('tests', m.slug)}">Test cases</h3>
${testMatrix(m)}
<h4>Test case details <button type="button" class="mini-btn" data-toggle="${anchor('tcs', m.slug)}">Expand all</button></h4>
<div id="${anchor('tcs', m.slug)}">${m.tests.map((t) => testCard(m, t)).join('\n')}</div>
<h3 id="${anchor('coverage', m.slug)}">Coverage</h3>
${coverage(m)}
${plansSection(m)}
<h3 id="${anchor('bugs', m.slug)}">Bugs</h3>
${bugsSection(m, img)}
<h3 id="${anchor('quality', m.slug)}">Accessibility and performance</h3>
${qualitySection(m)}

</section>`;
}

function versionOf(pkg) {
  try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'node_modules', ...pkg.split('/'), 'package.json'), 'utf8')).version; } catch { return null; }
}

// ------------------------------------------------------------------ page
function renderPage(models, img) {
  const gen = new Date();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const allTests = models.reduce((a, m) => a + m.tests.length, 0);
  const allAuto = models.reduce((a, m) => a + m.automated, 0);
  const counted = models.flatMap((m) => m.testRuns.slice(-10).flatMap((r) => r.tests || [])).filter((t) => t.status !== 'skipped');
  const rate = counted.length ? pct(counted.filter((t) => t.status === 'pass' || t.status === 'flaky').length, counted.length) : null;
  const failing = models.reduce((a, m) => a + m.failing.length, 0);
  const flaky = models.reduce((a, m) => a + m.flaky.length, 0);
  const bugs = models.reduce((a, m) => a + m.openBugs.length, 0);
  const runs = models.reduce((a, m) => a + m.runs.length, 0);
  const projRows = models.map((m) => {
    const s = m.lastRun ? summaryOf(m.lastRun) : null;
    const v = s ? verdict(s) : null;
    return `<tr><td><a href="#${anchor('p', m.slug)}"><strong>${esc(m.name)}</strong></a><div class="muted">${esc(m.slug)}</div></td><td>${v ? badge(v.cls, v.text) : '<span class="muted">no runs</span>'}${m.lastRun ? `<div class="muted">${esc(when(m.lastRun.startedAt))}</div>` : ''}</td><td>${s ? statusBar(s) : ''}</td><td>${m.passRate == null ? '-' : m.passRate + '%'}</td><td>${m.tests.length}</td><td>${m.automated}/${m.tests.length}</td><td>${m.failing.length}</td><td>${m.flaky.length}</td><td>${m.openBugs.length}</td></tr>`;
  }).join('');
  const nav = models.map((m) => `<a href="#${anchor('p', m.slug)}">${esc(m.name)}</a><span class="sub-nav"><a href="#${anchor('runs', m.slug)}">Runs</a><a href="#${anchor('tests', m.slug)}">Tests</a><a href="#${anchor('coverage', m.slug)}">Coverage</a><a href="#${anchor('bugs', m.slug)}">Bugs</a><a href="#${anchor('quality', m.slug)}">A11y/Perf</a></span>`).join('');
  const body = models.map((m) => projectSection(m, img)).join('\n');
  const tools = [['Playwright', versionOf('@playwright/test')], ['axe-core', versionOf('axe-core')]].filter(([, v]) => v).map(([k, v]) => `${k} ${v}`).join(', ');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>QA test report ${esc(fmtDate(gen))}</title>
<style>${CSS}</style>
</head>
<body>
<header class="top"><div class="wrap bar-row">
<div class="brand">QA test report</div>
<nav><a href="#overview">Overview</a>${nav}</nav>
<div class="gen">Generated ${esc(fmtDate(gen))} (${esc(tz)})</div>
</div></header>
<main class="wrap">
<section id="overview">
<h1>Overview</h1>
<div class="kpis">
${kpi('Projects', models.length)}
${kpi('Test cases', allTests, `${allAuto} automated (${pct(allAuto, allTests)}%)`)}
${kpi('Pass rate', rate == null ? '-' : rate + '%', 'last 10 test runs per project', rate == null ? '' : rate >= 95 ? 'good' : rate >= 80 ? 'warn' : 'bad')}
${kpi('Failing now', failing, '', failing ? 'bad' : 'good')}
${kpi('Flaky', flaky, '', flaky ? 'warn' : 'good')}
${kpi('Open bugs', bugs, '', bugs ? 'warn' : 'good')}
${kpi('Runs', runs)}
</div>
<table class="mini projects"><thead><tr><th>Project</th><th>Last test run</th><th>Results</th><th>Pass rate</th><th>Tests</th><th>Automated</th><th>Failing</th><th>Flaky</th><th>Open bugs</th></tr></thead><tbody>${projRows || '<tr><td colspan="9" class="muted">No projects yet.</td></tr>'}</tbody></table>
<p class="muted small">Runners: <strong>Playwright</strong> = the POM suite in <code>tests/e2e</code> run by Playwright (Test Manager, terminal or CI). <strong>Manual</strong> = a tester stepped through the test case in the Test Manager.</p>
</section>
${body}
</main>
<footer class="wrap"><p class="muted small">Generated by <code>test-manager/lib/html-report.mjs</code> from <code>${esc(ROOT)}</code>${tools ? ` with ${esc(tools)}` : ''}. Rebuild with <code>npm run tm:report</code> or the Overview report button in the Test Manager.</p></footer>
<div id="lightbox" hidden><img alt="Enlarged screenshot"><p>Click or press Escape to close</p></div>
<script>${JS}</script>
</body>
</html>`;
}

export function buildHtmlReport(opts = {}) {
  const out = opts.out ? path.resolve(ROOT, opts.out) : path.join(REPORTS, 'index.html');
  const slugs = opts.project ? [opts.project] : projectSlugs();
  const img = makeImager({ outDir: path.dirname(out), embed: opts.embed !== false, budget: (opts.maxEmbedMB ?? 25) * 1024 * 1024 });
  const models = slugs.map((s) => buildModel(loadProject(s)));
  const html = renderPage(models, img);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  return { out, kb: Math.round(Buffer.byteLength(html) / 1024), projects: slugs.length, images: img.stats() };
}

const CSS = `
:root{--bg:#f6f8fa;--card:#fff;--text:#1f2328;--muted:#57606a;--border:#d0d7de;--accent:#0969da;
--pass:#1a7f37;--fail:#cf222e;--flaky:#bf8700;--blocked:#8250df;--skipped:#8c959f}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;font:14px/1.5 -apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:var(--text);background:var(--bg)}
a{color:var(--accent);text-decoration:none}a:hover{text-decoration:underline}
[id]{scroll-margin-top:84px}
.rid{white-space:nowrap}h5 a,h5 code{text-transform:none}
.wrap{max-width:1240px;margin:0 auto;padding:0 20px}
header.top{background:#0d1117;color:#f0f6fc;position:sticky;top:0;z-index:20;box-shadow:0 1px 0 #30363d}
.bar-row{display:flex;align-items:center;gap:18px;min-height:56px;flex-wrap:wrap}
.brand{font-weight:700;font-size:16px}
header nav{display:flex;gap:6px 14px;flex-wrap:wrap;flex:1}
header nav a{color:#f0f6fc;font-weight:600}
header .sub-nav a{color:#9ecbff;font-weight:400;margin-left:10px;font-size:13px}
.gen{color:#c9d1d9;font-size:12px}
h1{font-size:24px;margin:24px 0 12px}
h2{font-size:22px;margin:40px 0 4px;padding-top:12px;border-top:2px solid var(--border)}
h3{font-size:17px;margin:28px 0 10px;display:flex;align-items:center;gap:10px}
h4{font-size:14px;margin:18px 0 8px}
h5{font-size:13px;margin:14px 0 6px;color:var(--muted);text-transform:uppercase;letter-spacing:.03em}
.slug{font-size:13px;font-weight:400;color:var(--muted);font-family:ui-monospace,Consolas,monospace;margin-left:6px}
.desc{margin:4px 0 8px;color:var(--muted)}
.muted{color:var(--muted)}.small{font-size:12px}
.envs{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0 14px}
.env{background:var(--card);border:1px solid var(--border);border-radius:6px;padding:3px 10px;font-size:13px}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin:10px 0 16px}
.kpi{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:10px 14px;border-top:3px solid var(--border)}
.kpi.good{border-top-color:var(--pass)}.kpi.warn{border-top-color:var(--flaky)}.kpi.bad{border-top-color:var(--fail)}
.kpi .l{color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:.05em;font-weight:600}
.kpi .v{font-size:24px;font-weight:650;line-height:1.3;margin-top:2px}
.kpi .v .badge{font-size:13px;vertical-align:middle}
.kpi .s{color:var(--muted);font-size:12px}
.badge{display:inline-block;padding:1px 9px;border-radius:999px;font-size:12px;font-weight:600;border:1px solid transparent;white-space:nowrap}
.s-pass{background:#dafbe1;color:#116329;border-color:#aceebb}
.s-fail{background:#ffebe9;color:#a40e26;border-color:#ffcecb}
.s-flaky{background:#fff8c5;color:#6f4400;border-color:#eed888}
.s-blocked{background:#fbefff;color:#6639ba;border-color:#e6ccff}
.s-skipped{background:#f6f8fa;color:#57606a;border-color:#d0d7de}
.s-never,.s-untested{background:#fff;color:#57606a;border:1px dashed #afb8c1}
.tag{display:inline-block;padding:0 7px;border-radius:5px;font-size:12px;background:#eef1f4;color:#3d444d;border:1px solid #d8dee4;white-space:nowrap}
.tag.flow{background:#fbefff;color:#6639ba;border-color:#e6ccff;font-weight:600}
.ftree{list-style:none;padding-left:0;margin:4px 0}.ftree .ftree{padding-left:22px;border-left:2px solid #e6ccff;margin-left:6px}
.ftree li{padding:2px 0}.ftree .num{color:#59636e;font-weight:600;margin-right:4px}
.tag.auto{background:#ddf4ff;color:#0a4b8c;border-color:#b6e3ff}
.prio{display:inline-block;font-weight:700;font-size:12px;padding:0 7px;border-radius:5px;border:1px solid var(--border)}
.p-P0{background:#ffebe9;color:#a40e26}.p-P1{background:#fff1e5;color:#953800}.p-P2{background:#ddf4ff;color:#0a4b8c}.p-P3{background:#f6f8fa;color:#57606a}
.sev{display:inline-block;font-weight:700;font-size:12px;padding:0 8px;border-radius:999px;text-transform:capitalize}
.sev-critical{background:#cf222e;color:#fff}.sev-major{background:#ffebe9;color:#a40e26}.sev-minor{background:#fff8c5;color:#6f4400}.sev-trivial{background:#eef1f4;color:#3d444d}
.c-pass{background:var(--pass);fill:var(--pass)}.c-fail{background:var(--fail);fill:var(--fail)}.c-flaky{background:var(--flaky);fill:var(--flaky)}
.c-blocked{background:var(--blocked);fill:var(--blocked)}.c-skipped{background:var(--skipped);fill:var(--skipped)}
.bar{display:flex;height:8px;border-radius:4px;overflow:hidden;background:#eaeef2;min-width:120px;flex-basis:100%}
.bar span{display:block;height:100%}
.counts{display:inline-flex;gap:10px;font-size:12px;font-weight:600}
.n-pass{color:#116329}.n-fail{color:#a40e26}.n-flaky{color:#6f4400}.n-blocked{color:#6639ba}.n-skipped{color:#57606a}
table{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--border);border-radius:8px;overflow:hidden}
th,td{text-align:left;padding:7px 10px;border-bottom:1px solid #eaeef2;vertical-align:top}
thead th{font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);background:#f6f8fa;font-weight:600}
tbody tr:last-child td,tbody tr:last-child th{border-bottom:0}
table.kv{margin-bottom:10px}table.kv th{width:110px;color:var(--muted);font-weight:600;font-size:12px;background:#fafbfc}
table.mini{margin:6px 0 12px}
table.matrix tbody tr:hover{background:#f6f8fa}
code{font-family:ui-monospace,Consolas,monospace;font-size:12px;background:#eff2f5;padding:1px 5px;border-radius:4px;word-break:break-word}
pre{background:#0d1117;color:#f0f6fc;padding:10px 12px;border-radius:6px;overflow:auto;font-size:12px;white-space:pre-wrap}
.insights{list-style:none;padding:0;margin:0;display:grid;gap:6px}
.insights li{background:var(--card);border:1px solid var(--border);border-left:4px solid var(--accent);border-radius:6px;padding:7px 12px}
.insights li.good{border-left-color:var(--pass)}.insights li.warn{border-left-color:var(--flaky)}.insights li.bad{border-left-color:var(--fail)}
figure.chart{margin:0;background:var(--card);border:1px solid var(--border);border-radius:8px;padding:10px 12px}
figure.chart svg{width:100%;height:auto;display:block}
svg .grid{stroke:#eaeef2}svg .ax{font-size:11px;fill:#57606a}svg .ax2{font-size:10px;fill:#6e7781}
svg a rect{transition:opacity .15s}svg a:hover rect{opacity:.8}
.legend{display:flex;gap:14px;flex-wrap:wrap;font-size:12px;margin-top:6px}
.legend i{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:5px;vertical-align:-1px}
details.card{background:var(--card);border:1px solid var(--border);border-radius:8px;margin:8px 0}
details.card>summary{cursor:pointer;padding:10px 14px;display:flex;gap:8px 10px;align-items:center;flex-wrap:wrap;list-style:none}
details.card>summary::-webkit-details-marker,details.sub>summary::-webkit-details-marker{display:none}
details.card>summary::before,details.sub>summary::before{content:"";width:0;height:0;border-left:6px solid #57606a;border-top:5px solid transparent;border-bottom:5px solid transparent;transition:transform .15s}
details[open]>summary::before{transform:rotate(90deg)}
details.card[open]>summary{border-bottom:1px solid var(--border)}
.right{margin-left:auto;display:inline-flex;gap:8px;align-items:center}
.ttl{font-weight:500}
.card-body{padding:12px 14px}
.card-body.two{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:20px}
details.sub{border:1px solid #eaeef2;border-radius:6px;margin:6px 0;background:#fff}
details.sub>summary{cursor:pointer;padding:7px 10px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;list-style:none}
details.sub[open]>summary{background:#f6f8fa;border-bottom:1px solid #eaeef2}
.sub-body{padding:8px 12px 12px}
ul.facts{margin:4px 0 8px;padding-left:18px}
ul.checks{list-style:none;padding:0;margin:4px 0}
ul.checks li{padding:3px 0;border-bottom:1px dashed #eaeef2}
ul.checks .mark{display:inline-block;width:38px;text-align:center;font-size:10px;font-weight:700;border-radius:4px;padding:0 4px;margin-right:6px}
ul.checks li.ok .mark{background:#dafbe1;color:#116329}ul.checks li.ko .mark{background:#ffebe9;color:#a40e26}
ul.checks .actual{margin:2px 0 0 46px;font-size:12px;color:var(--muted)}
.note{background:#f6f8fa;border-left:3px solid var(--border);padding:6px 10px;border-radius:4px}
.shots{display:flex;flex-wrap:wrap;gap:12px}
.shots figure{margin:0;max-width:300px}
.shots img,img.inline{width:300px;max-width:100%;border:1px solid var(--border);border-radius:6px;cursor:zoom-in;display:block}
.shots figcaption{font-size:11px;color:var(--muted);margin-top:3px;word-break:break-all}
.missing{width:300px;height:80px;display:flex;align-items:center;justify-content:center;border:1px dashed var(--border);color:var(--muted);font-size:12px}
.dots{display:inline-flex;gap:3px;flex-wrap:wrap}
.dot{width:13px;height:13px;border-radius:3px;display:inline-block}
.filters{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:4px 0 10px}
.chip{border:1px solid var(--border);background:#fff;border-radius:999px;padding:3px 11px;cursor:pointer;font-size:12px;color:var(--text)}
.chip[aria-pressed="true"]{background:#24292f;color:#fff;border-color:#24292f}
.filters select,.filters input{border:1px solid var(--border);border-radius:6px;padding:4px 8px;font:inherit;font-size:13px;background:#fff}
.filters input{min-width:240px;flex:1}
.mini-btn{font-size:12px;font-weight:500;border:1px solid var(--border);background:#fff;border-radius:6px;padding:2px 9px;cursor:pointer;color:var(--text)}
.grid2{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:18px}
.meter{display:inline-block;width:60px;height:6px;background:#eaeef2;border-radius:3px;overflow:hidden;margin-right:6px;vertical-align:middle}
.meter span{display:block;height:100%;background:var(--accent)}
.over{color:#a40e26;font-weight:700}.good-text{color:#116329}
.md-body table.md{margin:6px 0 10px}.md-body h4{margin:14px 0 6px;font-size:13px;text-transform:uppercase;color:var(--muted)}
.ref{font-style:italic;color:var(--muted)}.expect{font-weight:700;color:#0a4b8c}
#lightbox{position:fixed;inset:0;background:rgba(1,4,9,.88);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:50;cursor:zoom-out}
#lightbox[hidden]{display:none}#lightbox img{max-width:94vw;max-height:88vh;border-radius:6px;background:#fff}
#lightbox p{color:#c9d1d9;font-size:12px}
footer{margin:40px auto 30px}
@media (max-width:900px){.card-body.two,.grid2{grid-template-columns:1fr}.gen{display:none}}
@media print{header.top{position:static}.filters,.mini-btn{display:none}body{background:#fff}details.card,table{break-inside:avoid}}
`;

const JS = `
(function(){
  var lb=document.getElementById('lightbox');
  document.addEventListener('click',function(e){
    var im=e.target.closest&&e.target.closest('img.zoom');
    if(im){lb.querySelector('img').src=im.src;lb.hidden=false;return;}
    if(e.target.closest&&e.target.closest('#lightbox')){lb.hidden=true;}
    var t=e.target.closest&&e.target.closest('[data-toggle]');
    if(t){var box=document.getElementById(t.getAttribute('data-toggle'));var open=t.textContent.indexOf('Expand')===0;
      box.querySelectorAll('details').forEach(function(d){d.open=open;});t.textContent=open?'Collapse all':'Expand all';}
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){lb.hidden=true;}});
  function openTarget(){
    var id=decodeURIComponent(location.hash.slice(1));if(!id)return;
    var el=document.getElementById(id);if(!el)return;
    var d=el.tagName==='DETAILS'?el:el.closest('details');
    while(d){d.open=true;d=d.parentElement?d.parentElement.closest('details'):null;}
    setTimeout(function(){el.scrollIntoView({block:'start'});},0);
  }
  window.addEventListener('hashchange',openTarget);openTarget();
  window.addEventListener('beforeprint',function(){document.querySelectorAll('details').forEach(function(d){d.open=true;});});
  document.querySelectorAll('[data-filter-for]').forEach(function(box){
    var table=document.getElementById(box.getAttribute('data-filter-for'));
    var st={status:'all',prio:'all',q:''};
    function apply(){table.querySelectorAll('tbody tr').forEach(function(tr){
      var ok=(st.status==='all'||tr.getAttribute('data-status')===st.status)&&(st.prio==='all'||tr.getAttribute('data-priority')===st.prio)&&(!st.q||tr.textContent.toLowerCase().indexOf(st.q)>=0);
      tr.hidden=!ok;});}
    box.querySelectorAll('button[data-status]').forEach(function(b){b.addEventListener('click',function(){
      st.status=b.getAttribute('data-status');box.querySelectorAll('button[data-status]').forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});apply();});});
    var sel=box.querySelector('select');if(sel)sel.addEventListener('change',function(){st.prio=sel.value;apply();});
    var q=box.querySelector('input[type=search]');if(q)q.addEventListener('input',function(){st.q=q.value.trim().toLowerCase();apply();});
  });
})();
`;

// Shared building blocks for the per-run report (run-report.mjs).
export {
  esc, when, dur, pct, plural, badge, statusBar, counts, verdict, checksList, issuesBlock, a11yTable, perfCells, makeImager, stripId,
  versionOf, kpi, summaryOf, runMs, shots, CSS as REPORT_CSS, JS as REPORT_JS, RUNNER_LABEL, STATUS_LABEL, STATUSES, PERF_LIMITS,
};
