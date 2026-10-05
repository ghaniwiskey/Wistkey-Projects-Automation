// Markdown run report (report.md) and run summary, shared by the Playwright reporter and the web app.
const pad = (n) => String(n).padStart(2, '0');
const trunc = (s, n) => { const x = String(s ?? ''); return x.length > n ? x.slice(0, n - 1) + '…' : x; };
export function summarize(tests) {
  const s = { total: tests.length, pass: 0, fail: 0, flaky: 0, blocked: 0, skipped: 0 };
  for (const t of tests) s[t.status] = (s[t.status] || 0) + 1;
  return s;
}
const cell = (s) => String(s == null ? '' : s).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
const dur = (ms) => {
  const s = Math.round((ms || 0) / 100) / 10;
  return s < 60 ? `${s.toFixed(1)}s` : `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`;
};
const when = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const reEsc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const titleOf = (t) => String(t.title || '').replace(new RegExp('^\\s*' + reEsc(t.id) + '\\b[:\\s-]*'), '') || String(t.title || '');
const msOrDash = (v) => (v == null ? '-' : `${v}ms`);
export function renderReport(r) {
  const tests = r.tests || [];
  const s = r.summary || summarize(tests);
  const verdict = s.fail ? `FAIL (${s.fail} failed)` : s.blocked ? `INCOMPLETE (${s.blocked} blocked)` : s.total ? 'PASS' : 'EMPTY';
  const ms = r.finishedAt && r.startedAt ? new Date(r.finishedAt) - new Date(r.startedAt) : 0;
  const L = [];
  L.push(`# Run report: ${r.project} / ${r.suite} / ${r.env}`, '');
  L.push('| Field | Value |', '|---|---|');
  L.push(`| Result | **${verdict}** |`, `| Run | ${cell(r.runId)} |`, `| Runner | ${cell(r.runner)}${r.workers && r.workers.length > 1 ? ` (workers: ${r.workers.join(', ')})` : ''} |`);
  L.push(`| Base URL | ${cell(r.baseUrl)} |`, `| Started | ${when(r.startedAt)} |`, `| Duration | ${dur(ms)} |`, '');
  L.push('## Summary', '', '| Total | Pass | Fail | Flaky | Blocked | Skipped |', '|---:|---:|---:|---:|---:|---:|');
  L.push(`| ${s.total} | ${s.pass} | ${s.fail} | ${s.flaky} | ${s.blocked} | ${s.skipped} |`, '');
  L.push('## Results', '', '| ID | Title | Status | Checks | Time | Notes | Evidence |', '|---|---|---|---|---|---|---|');
  for (const t of tests) {
    const checks = t.checks || [];
    const passed = checks.filter((c) => c.pass).length;
    const notes = [t.failureType && t.status === 'fail' ? t.failureType : '', t.bug || '', t.issues && t.issues.total ? `${t.issues.total} console/network issues` : '', t.attempts > 1 ? `attempt ${t.attempts}` : '', t.status === 'skipped' || t.status === 'blocked' ? (t.notes || [])[0] || '' : '']
      .filter(Boolean).join('; ');
    const allEv = [...(t.history || []).flatMap((h) => h.evidence || []), ...(t.evidence || [])];
    const ev = allEv.map((e, i) => `[${i + 1}](${e})`).join(' ');
    L.push(`| ${cell(t.id)} | ${cell(titleOf(t))} | ${t.status} | ${checks.length ? `${passed}/${checks.length}` : '-'} | ${dur(t.durationMs)} | ${cell(notes) || '-'} | ${ev || '-'} |`);
  }
  L.push('');
  const bad = tests.filter((t) => ['fail', 'flaky', 'blocked'].includes(t.status));
  if (bad.length) {
    L.push('## Failures and warnings', '');
    for (const t of bad) {
      L.push(`### ${t.id}: ${titleOf(t)} (${t.status})`, '');
      if (t.status === 'fail') L.push(`- Failure type: ${t.failureType || 'untriaged'}${t.bug ? ` (bug ${t.bug})` : ''}`);
      if (t.file) L.push(`- Source: \`${t.file}\``);
      if (t.url) L.push(`- URL: ${t.url}`);
      for (const c of (t.checks || []).filter((x) => !x.pass)) L.push(`- Failed: ${c.label}${c.actual ? ` (actual: \`${trunc(c.actual, 200).replace(/`/g, "'")}\`)` : ''}`);
      if (t.error) L.push(`- Error: ${trunc(t.error, 400).replace(/\n/g, ' ')}`);
      for (const h of t.history || []) {
        L.push(`- Earlier attempt: ${h.status}${h.failed && h.failed.length ? ` (failed: ${h.failed.join('; ')})` : ''}${h.issues ? `, ${h.issues} console/network issues` : ''}${(h.evidence || []).map((e) => ` [screenshot](${e})`).join('')}`);
      }
      for (const n of t.notes || []) L.push(`- Note: ${n}`);
      const shots = (t.evidence || []).filter((e) => /\.(png|jpe?g|webp)$/i.test(e));
      if (shots.length) L.push('', `![${t.id}](${shots[shots.length - 1]})`);
      L.push('');
    }
  }
  const noisy = tests.filter((t) => t.issues && t.issues.total);
  if (noisy.length) {
    L.push('## Console and network issues', '');
    for (const t of noisy) {
      L.push(`**${t.id}**`);
      for (const x of t.issues.pageErrors || []) L.push(`- JS error: ${trunc(x, 300)}`);
      for (const x of t.issues.consoleErrors || []) L.push(`- console.error: ${trunc(x, 300)}`);
      for (const x of t.issues.failedRequests || []) L.push(`- Request: ${trunc(x, 300)}`);
      L.push('');
    }
  }
  const ax = tests.filter((t) => t.a11y && t.a11y.length);
  if (ax.length) {
    L.push('## Accessibility (axe-core)', '', '| Test | Page | Rule | Impact | Nodes | Help |', '|---|---|---|---|---:|---|');
    for (const t of ax) for (const a of t.a11y) for (const v of a.violations) L.push(`| ${t.id} | ${cell(a.url)} | ${v.id} | ${v.impact} | ${v.count} | [${cell(v.help)}](${v.helpUrl}) |`);
    L.push('');
  }
  const pf = tests.filter((t) => t.perf && t.perf.length);
  if (pf.length) {
    L.push('## Performance', '', '| Test | Page | TTFB | DCL | Load | LCP | CLS | Resources |', '|---|---|---:|---:|---:|---:|---:|---:|');
    for (const t of pf) for (const p of t.perf) L.push(`| ${t.id} | ${cell(p.url)} | ${msOrDash(p.ttfbMs)} | ${msOrDash(p.domContentLoadedMs)} | ${msOrDash(p.loadMs)} | ${msOrDash(p.lcpMs)} | ${p.cls ?? '-'} | ${p.resources} (${p.resourcesKB} KB) |`);
    L.push('');
  }
  if (r.notes) L.push('## Notes', '', String(r.notes), '');
  return L.join('\n');
}
