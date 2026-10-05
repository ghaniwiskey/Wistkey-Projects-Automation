import { html, useState, useEffect, useRef } from '../../vendor/preact-htm.mjs';
import { useResource, get, put, del, post, onEvent, toast } from '../api.js';
import { Page, Badge, Verdict, StatusBar, Counts, Empty, Loading, ErrorBox, Checks, Inline, RUNNER_LABEL, STATUS_LABEL, ago, dur, fmtDate, ResultTree } from '../ui.js';
import { RunDialog } from '../run-dialog.js';

export function RunList({ slug, state, sandboxed }) {
  const { data: runs, error } = useResource(`/api/projects/${slug}/runs`, { project: slug, kinds: ['runs'] });
  const { data: p } = useResource(`/api/projects/${slug}`, { project: slug });
  const [runner, setRunner] = useState('all');
  if (error) return html`<${ErrorBox} error=${error} />`;
  if (!runs || !p) return html`<${Loading} />`;
  const rows = runs.filter((r) => runner === 'all' || r.runner === runner);
  const jobs = (state.jobs || []).filter((j) => j.project === slug && j.status === 'running');
  const remove = async (r) => {
    if (!confirm(`Delete run ${r.runId} and its screenshots? This cannot be undone.`)) return;
    try { await del(`/api/projects/${slug}/runs/${r.runId}`); toast('Run deleted', 'good'); } catch (e) { toast(e.message, 'error'); }
  };
  return html`<${Page} crumbs=${[{ label: p.name, href: `#/p/${slug}` }]} title="Runs" sub="Every Playwright run (app, terminal or CI) and manual run, newest first.">
    ${jobs.map((j) => html`<div class="banner"><${Badge} status="running" /> Playwright run in progress: <a href=${`#/jobs/${j.id}`}>open live console</a></div>`)}
    <div class="toolbar">
      <select value=${runner} onChange=${(e) => setRunner(e.target.value)}><option value="all">All runners</option>${Object.entries(RUNNER_LABEL).map(([k, v]) => html`<option value=${k}>${v}</option>`)}</select>
      <span class="muted small right">${rows.length} runs</span>
    </div>
    ${rows.length ? html`<div class="tablewrap"><table class="t"><thead><tr><th>Result</th><th>Run</th><th>Runner</th><th>Env</th><th>Started</th><th>Duration</th><th>Results</th><th>Checks</th><th></th></tr></thead><tbody>
      ${rows.map((r) => html`<tr>
        <td><${Verdict} run=${r} /></td>
        <td><a href=${r.inProgress && r.runner === 'manual' ? `#/p/${slug}/manual/${r.runId}` : `#/p/${slug}/runs/${r.runId}`}><strong>${r.suite}</strong></a>
          ${r.plan ? html` <a class="tag" href=${`#/p/${slug}/plans/${r.plan}`}>${r.plan}</a>` : null}${r.pseudo ? html` <span class="tag">scan</span>` : null}
          <div class="muted small">${r.runId}</div></td>
        <td>${RUNNER_LABEL[r.runner] || r.runner}</td>
        <td>${r.env}</td>
        <td class="nowrap" title=${fmtDate(r.startedAt)}>${ago(r.startedAt)}</td>
        <td>${dur(r.durationMs)}</td>
        <td style="min-width:170px"><${StatusBar} s=${r.summary} /><${Counts} s=${r.summary} /></td>
        <td class="small">${r.checks.total ? `${r.checks.pass}/${r.checks.total}` : '-'}</td>
        <td class="nowrap">${r.inProgress && r.runner === 'manual' ? html`<a class="btn sm blue" href=${`#/p/${slug}/manual/${r.runId}`}>Continue</a>` : html`<a class="btn sm" href=${`/run-report/${slug}/${r.runId}`} target="_blank" rel="noopener" title="Standalone HTML test report for this run">Test report</a>`}
          <button class="btn sm ghost" title="Delete run" onClick=${() => remove(r)}>Delete</button></td>
      </tr>`)}
    </tbody></table></div>` : html`<${Empty} title="No runs yet">Run tests from the Test cases page or a test plan, or run npx playwright test in a terminal.</${Empty}>`}
  </${Page}>`;
}

function Evidence({ list, title }) {
  const imgs = (list || []).filter((e) => e.image);
  const other = (list || []).filter((e) => !e.image);
  if (!imgs.length && !other.length) return null;
  return html`<h3>${title || 'Evidence'}</h3><div class="shots">${imgs.map((e) => html`<figure style="margin:0"><img class="zoom" src=${e.url} alt=${e.path} /><figcaption class="muted small">${e.path.split('/').pop()}</figcaption></figure>`)}</div>
    ${other.map((e) => html`<div class="small"><a href=${e.url}>${e.path.split('/').pop()}</a>${/\.zip$/.test(e.path) ? html` <span class="muted">(Playwright trace: open with npx playwright show-trace)</span>` : null}</div>`)}`;
}

function TestResult({ slug, run, t, open, bugs }) {
  const [ft, setFt] = useState(t.failureType || '');
  const [bug, setBug] = useState(t.bug || '');
  const triage = async () => {
    try { await put(`/api/projects/${slug}/runs/${run.runId}/tests/${t.id}`, { failureType: ft, bug }); toast(`${t.id} triaged`, 'good'); } catch (e) { toast(e.message, 'error'); }
  };
  const checks = t.checks || [];
  return html`<details class="res" id=${`r-${t.id}`} open=${open}>
    <summary><${Badge} status=${t.status} /><strong>${t.id}</strong> <span><${Inline} text=${String(t.title || '').replace(new RegExp('^' + t.id + '[:\\s-]*'), '')} /></span>
      <span class="right muted small">${checks.length ? `${checks.filter((c) => c.pass).length}/${checks.length} checks, ` : ''}${dur(t.durationMs)}${t.attempts > 1 ? `, ${t.attempts} attempts` : ''}</span></summary>
    <div class="inner">
      ${t.known ? html`<div class="small" style="margin-bottom:6px"><a href=${`#/p/${slug}/tests/${t.id}`}>Open test case</a>${t.file ? html` <span class="muted">(${t.file})</span>` : null}</div>` : null}
      ${t.error ? html`<h3>Error</h3><pre>${t.error}</pre>` : null}
      ${t.steps && t.steps.length ? html`<h3>Steps</h3><${ResultTree} items=${t.steps} />` : null}
      ${t.flows && t.flows.length && !(t.steps && t.steps.length) ? html`<h3>Flows</h3><ul class="checks">${t.flows.map((x) => html`<li class=${x.status === 'fail' ? 'ko' : x.status === 'pass' ? 'ok' : ''}><span class="mark">${(x.status || '-').toUpperCase()}</span><span class="tag flow">Flow</span> ${x.name}${x.note ? html` <span class="muted small">${x.note}</span>` : null}</li>`)}</ul>` : null}
      <h3>Checks</h3><${Checks} checks=${checks} />
      ${(t.notes || []).length ? html`<h3>Notes</h3>${t.notes.map((n) => html`<p class="small">${n}</p>`)}` : null}
      ${t.issues && t.issues.total ? html`<h3>Console and network issues</h3><ul class="small">${[...(t.issues.pageErrors || []).map((x) => `JS error: ${x}`), ...(t.issues.consoleErrors || []).map((x) => `console.error: ${x}`), ...(t.issues.failedRequests || []).map((x) => `Request: ${x}`)].map((x) => html`<li><code>${x}</code></li>`)}</ul>` : null}
      ${(t.history || []).map((h, i) => html`<div class="small muted">Earlier attempt ${i + 1}: ${STATUS_LABEL[h.status] || h.status}${h.failed && h.failed.length ? `, failed: ${h.failed.join('; ')}` : ''}</div><${Evidence} list=${h.evidence} title=${`Attempt ${i + 1} evidence`} />`)}
      <${Evidence} list=${t.evidence} />
      ${(t.a11y || []).map((a) => html`<h3>Accessibility: ${a.url}</h3>${a.violations.length ? html`<ul class="small">${a.violations.map((v) => html`<li><a href=${v.helpUrl} target="_blank" rel="noopener"><code>${v.id}</code></a> ${v.impact}, ${v.count} elements</li>`)}</ul>` : html`<p class="n-pass small">No violations.</p>`}`)}
      ${(t.perf || []).map((x) => html`<h3>Performance: ${x.url}</h3><p class="small">TTFB ${x.ttfbMs ?? '-'} ms, load ${x.loadMs ?? '-'} ms, LCP ${x.lcpMs ?? 'n/a'}, CLS ${x.cls ?? '-'}</p>`)}
      ${t.status === 'fail' && !run.inProgress ? html`<h3>Triage</h3><div class="row">
        <select style="width:auto" value=${ft} onChange=${(e) => setFt(e.target.value)}><option value="">Failure type...</option><option value="product-bug">Product bug</option><option value="test-issue">Test issue (outdated test)</option><option value="environment">Environment</option><option value="untriaged">Untriaged</option></select>
        <select style="width:auto" value=${bug} onChange=${(e) => setBug(e.target.value)}><option value="">No linked bug</option>${bugs.map((b) => html`<option value=${b.id}>${b.id}: ${b.title.slice(0, 50)}</option>`)}</select>
        <button class="btn sm" onClick=${triage}>Save triage</button>
        <a class="btn sm" href=${`#/p/${slug}/bugs/new?test=${t.id}&run=${run.runId}`}>Report new bug</a></div>` : null}
    </div>
  </details>`;
}

export function RunDetail({ slug, runId, query, sandboxed }) {
  const { data: r, error } = useResource(`/api/projects/${slug}/runs/${runId}`, { project: slug, kinds: ['runs'] });
  const { data: p } = useResource(`/api/projects/${slug}`, { project: slug });
  const { data: bugs } = useResource(`/api/projects/${slug}/bugs`, { project: slug, kinds: ['bugs'] });
  const { data: allTests } = useResource(`/api/projects/${slug}/tests`, { project: slug, kinds: ['tests', 'specs'] });
  const [dialog, setDialog] = useState(null);
  useEffect(() => {
    if (r && query.test) setTimeout(() => { const el = document.getElementById(`r-${query.test}`); if (el) el.scrollIntoView({ block: 'start' }); }, 50);
  }, [r && r.runId, query.test]);
  if (error) return html`<${ErrorBox} error=${error} />`;
  if (!r || !p) return html`<${Loading} />`;
  if (r.inProgress && r.runner === 'manual') {
    return html`<${Page} title="Manual run in progress"><p>This manual run is not finished yet. <a href=${`#/p/${slug}/manual/${runId}`}>Continue executing it</a>.</p></${Page}>`;
  }
  const failed = r.tests.filter((t) => ['fail', 'flaky', 'blocked'].includes(t.status) && t.known);
  return html`<${Page} crumbs=${[{ label: p.name, href: `#/p/${slug}` }, { label: 'Runs', href: `#/p/${slug}/runs` }]}
    title=${html`<${Verdict} run=${r} /> ${r.suite}`} sub=${html`${RUNNER_LABEL[r.runner] || r.runner} on ${r.env} (${r.baseUrl}), started ${fmtDate(r.startedAt)}, took ${dur(r.durationMs)}${r.plan ? html`, plan <a href=${`#/p/${slug}/plans/${r.plan}`}>${r.plan}</a>` : ''}${r.request ? `, Aside request ${r.request}` : ''}`}
    actions=${html`${failed.length ? html`<button class="btn blue" onClick=${() => setDialog({ tests: failed.map((t) => { const x = (allTests || []).find((y) => y.id === t.id) || {}; return { id: t.id, title: t.title, automated: !!x.automated, spec: x.spec || null }; }) })}>Rerun failed (${failed.length})</button>` : null}
      <a class="btn primary" href=${`/run-report/${slug}/${runId}`} target="_blank" rel="noopener" title="Self-contained HTML report you can save or share">Test report</a>`}>
    <div class="card pad section"><div class="row"><div class="grow"><${StatusBar} s=${r.summary} /></div><${Counts} s=${r.summary} /><span class="muted small">${r.checks.pass}/${r.checks.total} checks</span></div>
      ${r.notes ? html`<p class="small muted" style="margin:8px 0 0">${r.notes}</p>` : null}
      <p class="small muted" style="margin:6px 0 0">Folder <code>${r.folder}</code></p></div>
    ${r.tests.map((t) => html`<${TestResult} key=${t.id} slug=${slug} run=${r} t=${t} bugs=${bugs || []} open=${query.test === t.id || ['fail', 'flaky', 'blocked'].includes(t.status)} />`)}
    ${dialog ? html`<${RunDialog} project=${p} tests=${dialog.tests} onClose=${() => setDialog(null)} sandboxed=${sandboxed} />` : null}
  </${Page}>`;
}

export function JobConsole({ id }) {
  const [job, setJob] = useState(null);
  const [err, setErr] = useState(null);
  const logRef = useRef(null);
  useEffect(() => {
    let alive = true;
    get(`/api/jobs/${id}`).then((j) => { if (alive) { if (j.error === 'not found') setErr('This run is no longer in memory (the app was restarted). Find its results under Runs.'); else setJob(j); } }).catch((e) => setErr(e.message));
    const off = onEvent((type, j) => {
      if (type === 'job' && j.id === id) setJob((cur) => ({ ...(cur || {}), ...j, log: mergeLog(cur ? cur.log : [], j.logTail) }));
    });
    return () => { alive = false; off(); };
  }, [id]);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [job && job.log && job.log.length]);
  if (err) return html`<${ErrorBox} error=${err} />`;
  if (!job) return html`<${Loading} />`;
  const tests = Object.entries(job.tests || {});
  const done = tests.filter(([, t]) => ['pass', 'fail', 'flaky', 'skipped'].includes(t.status)).length;
  const cancel = async () => { try { await post(`/api/jobs/${id}/cancel`); toast('Stopping run...'); } catch (e) { toast(e.message, 'error'); } };
  return html`<${Page} crumbs=${[{ label: job.project, href: `#/p/${job.project}` }, { label: 'Runs', href: `#/p/${job.project}/runs` }]}
    title=${html`<${Badge} status=${job.status} /> Playwright run`} sub=${`${job.project} on ${job.env || 'default env'}${job.plan ? `, plan ${job.plan}` : ''}${job.headed ? ', headed' : ''}. Started ${ago(job.startedAt)}.`}
    actions=${html`${job.status === 'running' ? html`<button class="btn danger" onClick=${cancel}>Stop run</button>` : null}${(job.runIds || []).map((rid) => html`<a class="btn primary" href=${`#/p/${job.project}/runs/${rid}`}>Open results</a><a class="btn" href=${`/run-report/${job.project}/${rid}`} target="_blank" rel="noopener">Test report</a>`)}`}>
    ${job.error ? html`<div class="err">${job.error}</div>` : null}
    <div class="card pad section"><div class="row"><strong>${done}/${job.total || tests.length || '?'} tests finished</strong><span class="right muted small">${job.status === 'running' ? 'Live' : `Finished ${ago(job.finishedAt)}`}</span></div>
      <div class="progress" style="margin-top:8px"><span style=${`width:${job.total ? (100 * done) / job.total : 0}%`}></span></div></div>
    ${tests.length ? html`<div class="tablewrap section"><table class="t"><tbody>${tests.map(([tid, t]) => html`<tr><td style="width:110px"><${Badge} status=${t.status} /></td><td><strong>${tid}</strong> <span class="muted">${String(t.title || '').replace(/^[A-Z0-9]+-\d+:\s*/, '')}</span>${t.error ? html`<div class="small n-fail">${t.error}</div>` : null}</td><td class="small muted nowrap">${t.durationMs != null ? dur(t.durationMs) : ''}${t.retry ? ` (retry ${t.retry})` : ''}</td></tr>`)}</tbody></table></div>` : null}
    <h3>Output</h3>
    <pre class="log" ref=${logRef}>${(job.log || []).join('\n') || 'Waiting for output...'}</pre>
  </${Page}>`;
}

function mergeLog(old, tail) {
  if (!tail || !tail.length) return old || [];
  if (!old || !old.length) return tail;
  const last = old[old.length - 1];
  const idx = tail.lastIndexOf(last);
  return idx >= 0 ? [...old, ...tail.slice(idx + 1)] : [...old, ...tail];
}
