import { html, useState, useEffect } from '../../vendor/preact-htm.mjs';
import { useResource, put, post, toast, readFileAsDataUrl } from '../api.js';
import { Page, Badge, Prio, Loading, ErrorBox, Inline, StatusBar, Counts, pct, fmtDate } from '../ui.js';

const RESULT_BUTTONS = [['pass', 'Pass', 'P'], ['fail', 'Fail', 'F'], ['blocked', 'Blocked', 'B'], ['skipped', 'Skip', 'S']];

// Draft step results mirror the step tree: a plain step is a status string (or null),
// a flow is { status, steps: [...] }. Old runs without flows are plain lists.
const isFlow = (s) => s && s.kind === 'flow';
const initDraft = (items) => (items || []).map((s) => (isFlow(s) ? { status: s.status || null, steps: initDraft(s.steps) } : s.status || null));
const statusOf = (d) => (d && typeof d === 'object' ? d.status : d);
const hasFail = (list) => (list || []).some((d) => statusOf(d) === 'fail' || (d && typeof d === 'object' && hasFail(d.steps)));
const setAll = (items, list, st) => (items || []).map((s, i) => (isFlow(s) ? { status: st, steps: setAll(s.steps, (list[i] || {}).steps || [], st) } : st));
function rollUp(d) {
  // A flow follows its steps: any failed step fails it; all steps done marks it done.
  const kids = d.steps.map(statusOf);
  if (hasFail(d.steps)) return { ...d, status: 'fail' };
  if (kids.length && kids.every((x) => x === 'pass' || x === 'skipped')) return { ...d, status: d.status === 'skipped' ? 'skipped' : 'pass' };
  return { ...d, status: d.status === 'fail' ? null : d.status };
}

function suggest(d) {
  if (!d) return null;
  // Broken setup (a failed flow) means the test's own behavior was not reached.
  if (d.steps.some((x) => x && typeof x === 'object' && (x.status === 'fail' || hasFail(x.steps)))) return 'blocked';
  if (d.expected.includes('fail') || d.steps.includes('fail')) return 'fail';
  if (d.expected.length && d.expected.every((x) => x === 'pass')) return 'pass';
  return null;
}

const argText = (args) => Object.entries(args || {}).filter(([, v]) => v !== '' && v != null).map(([k, v]) => `${k}=${v}`).join(', ');
const FLOW_LABEL = { pass: 'Done', fail: 'Failed', skipped: 'Already done' };

function ManualSteps({ items, value, onChange, prefix = '' }) {
  const setAt = (i, v) => onChange(value.map((x, j) => (j === i ? v : x)));
  return html`<div>${items.map((s, i) => {
    const num = `${prefix}${i + 1}`;
    if (!isFlow(s)) {
      return html`<div class="xrow"><span class="muted"><strong>${num}.</strong></span><span class="txt"><${Inline} text=${s.text} /></span>
        <${Seg} value=${value[i]} options=${[['pass', 'Done'], ['fail', 'Fail'], ['skipped', 'Skip']]} onChange=${(v) => setAt(i, v)} /></div>`;
    }
    const d = value[i] || { status: null, steps: [] };
    const failed = d.status === 'fail' || hasFail(d.steps);
    const pick = (e, st) => {
      e.preventDefault();
      e.stopPropagation();
      if (d.status === st) setAt(i, { status: null, steps: setAll(s.steps, d.steps, null) });
      else if (st === 'fail') setAt(i, { ...d, status: 'fail' });
      else setAt(i, { status: st, steps: setAll(s.steps, d.steps, st === 'skipped' ? 'skipped' : 'pass') });
    };
    const done = d.steps.filter((x) => statusOf(x)).length;
    return html`<details class="xflow" open=${failed}>
      <summary><span class="muted"><strong>${num}.</strong></span><span class="tag flow">Flow</span>
        <span class="txt" style="flex:1;min-width:180px"><strong>${s.title || s.name}</strong>${argText(s.args) ? html` <span class="muted small">(${argText(s.args)})</span>` : null}
          <span class="muted small"> ${done}/${s.steps.length} steps${d.status ? html`, <strong class=${d.status === 'fail' ? 'n-fail' : ''}>${FLOW_LABEL[d.status]}</strong>` : ''}</span></span>
        <span class="seg">${[['pass', 'Done'], ['fail', 'Fail'], ['skipped', 'Already done']].map(([v, label]) => html`<button type="button" class=${d.status === v ? `on-${v}` : ''} title=${v === 'skipped' ? 'The result was already in place, so the steps were not repeated' : v === 'pass' ? 'Mark the whole flow and all its steps done' : 'The flow could not be completed'} onClick=${(e) => pick(e, v)}>${label}</button>`)}</span>
      </summary>
      <div class="xbody">
        ${s.skipIf ? html`<div class="muted small" style="margin:6px 0">Skip if already true: <${Inline} text=${s.skipIf} /></div>` : null}
        ${s.error ? html`<div class="err small">${s.error}</div>` : null}
        <${ManualSteps} items=${s.steps} value=${d.steps} prefix=${`${num}.`} onChange=${(v) => setAt(i, rollUp({ ...d, steps: v }))} />
        ${s.result && s.result.length ? html`<div class="muted small" style="margin-top:6px">Flow result: ${s.result.join('; ')}</div>` : null}
      </div>
    </details>`;
  })}</div>`;
}

function Seg({ value, options, onChange }) {
  return html`<span class="seg">${options.map(([v, label]) => html`<button type="button" class=${value === v ? `on-${v}` : ''} onClick=${() => onChange(value === v ? null : v)}>${label}</button>`)}</span>`;
}

export function ManualRun({ slug, runId }) {
  const { data: run, error } = useResource(`/api/projects/${slug}/runs/${runId}`, { project: slug, kinds: ['runs'] });
  const [cur, setCur] = useState(null);
  const [draft, setDraft] = useState(null);
  const [startAt, setStartAt] = useState(Date.now());
  const [saving, setSaving] = useState(false);
  const test = run && cur ? run.tests.find((t) => t.id === cur) : null;

  useEffect(() => {
    if (run && !cur) setCur((run.tests.find((t) => t.status === 'untested') || run.tests[0] || {}).id);
  }, [run && run.runId]);
  useEffect(() => {
    if (!test) return;
    setDraft({
      steps: initDraft(test.steps), expected: test.expected.map((s) => s.status),
      note: (test.notes || []).filter((n) => !/^Not executed/.test(n)).join('\n'), status: test.status === 'untested' ? null : test.status,
    });
    setStartAt(Date.now());
  }, [cur, run && run.runId]);

  const go = (dir) => {
    const i = run.tests.findIndex((t) => t.id === cur);
    const n = run.tests[i + dir];
    if (n) setCur(n.id);
  };
  const save = async (status, next) => {
    const st = status || (draft && draft.status) || suggest(draft);
    if (!st) { toast('Pick a result first: Pass, Fail, Blocked or Skip', 'error'); return; }
    setSaving(true);
    try {
      await put(`/api/projects/${slug}/manual-runs/${runId}/tests/${cur}`, { steps: draft.steps, expected: draft.expected, note: draft.note, status: st, addDurationMs: Date.now() - startAt });
      setStartAt(Date.now());
      setDraft((d) => ({ ...d, status: st }));
      toast(`${cur}: ${st}`, st === 'pass' ? 'good' : st === 'fail' ? 'error' : 'info');
      if (next) {
        const i = run.tests.findIndex((t) => t.id === cur);
        const after = [...run.tests.slice(i + 1), ...run.tests.slice(0, i)].find((t) => t.status === 'untested' && t.id !== cur);
        if (after) setCur(after.id);
      }
    } catch (e) { toast(e.message, 'error'); } finally { setSaving(false); }
  };
  const upload = async (file) => {
    if (!file) return;
    try {
      const data = await readFileAsDataUrl(file);
      await post(`/api/projects/${slug}/manual-runs/${runId}/tests/${cur}/evidence`, { name: (file.name || 'pasted').replace(/\.[^.]+$/, ''), data });
      toast('Screenshot attached', 'good');
    } catch (e) { toast(e.message, 'error'); }
  };
  const finish = async () => {
    const left = run.tests.filter((t) => t.status === 'untested').length;
    if (left && !confirm(`${left} test(s) are not executed yet. They will be marked skipped. Finish the run?`)) return;
    try { await post(`/api/projects/${slug}/manual-runs/${runId}/finish`, {}); toast('Manual run finished', 'good'); location.hash = `#/p/${slug}/runs/${runId}`; } catch (e) { toast(e.message, 'error'); }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (!draft || saving || e.ctrlKey || e.metaKey || e.altKey) return;
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      const k = e.key.toLowerCase();
      const map = { p: 'pass', f: 'fail', b: 'blocked', s: 'skipped' };
      if (map[k]) { e.preventDefault(); save(map[k], true); } else if (k === 'j' || e.key === 'ArrowDown') { e.preventDefault(); go(1); } else if (k === 'k' || e.key === 'ArrowUp') { e.preventDefault(); go(-1); }
    };
    const onPaste = (e) => {
      const item = [...((e.clipboardData && e.clipboardData.items) || [])].find((i) => i.type.startsWith('image/'));
      if (item) { e.preventDefault(); upload(item.getAsFile()); }
    };
    addEventListener('keydown', onKey);
    addEventListener('paste', onPaste);
    return () => { removeEventListener('keydown', onKey); removeEventListener('paste', onPaste); };
  });

  if (error) return html`<${ErrorBox} error=${error} />`;
  if (!run) return html`<${Loading} />`;
  if (!run.inProgress) {
    return html`<${Page} crumbs=${[{ label: 'Runs', href: `#/p/${slug}/runs` }]} title="This manual run is finished"><p><a class="btn primary" href=${`#/p/${slug}/runs/${runId}`}>Open the results</a></p></${Page}>`;
  }
  const s = run.summary;
  const executed = s.total - (s.untested || 0);
  const sug = suggest(draft);
  return html`<${Page} crumbs=${[{ label: slug, href: `#/p/${slug}` }, { label: 'Runs', href: `#/p/${slug}/runs` }]} title="Manual test run"
    sub=${html`Environment <strong>${run.env}</strong>: <a href=${run.baseUrl} target="_blank" rel="noopener">${run.baseUrl}</a>${run.plan ? html`, plan <a href=${`#/p/${slug}/plans/${run.plan}`}>${run.plan}</a>` : ''}. Started ${fmtDate(run.startedAt)}.`}
    actions=${html`<a class="btn" href=${run.baseUrl} target="_blank" rel="noopener">Open app under test</a><button class="btn primary" onClick=${finish}>Finish run</button>`}>
    <div class="card pad section"><div class="row"><strong>${executed}/${s.total} executed (${pct(executed, s.total)}%)</strong><${Counts} s=${s} /><span class="right muted small">Shortcuts: <span class="kbd">P</span> pass <span class="kbd">F</span> fail <span class="kbd">B</span> blocked <span class="kbd">S</span> skip (save and next), <span class="kbd">J</span>/<span class="kbd">K</span> move, <span class="kbd">Ctrl</span>+<span class="kbd">V</span> paste screenshot</span></div>
      <div style="margin-top:8px"><${StatusBar} s=${s} /></div></div>
    <div class="exec">
      <div class="list">${run.tests.map((t) => html`<a href="javascript:void 0" class=${t.id === cur ? 'on' : ''} onClick=${() => setCur(t.id)}><${Badge} status=${t.status} /><span class="ttl"><strong>${t.id}</strong> ${t.title}</span></a>`)}</div>
      ${test && draft ? html`<div class="card pad">
        <div class="row"><h2 style="margin:0"><span class="muted">${test.id}</span> ${test.title}</h2><span class="right"><${Prio} p=${test.priority} /> <${Badge} status=${test.status} /></span></div>
        ${test.goal ? html`<p class="muted"><${Inline} text=${test.goal} /></p>` : null}
        ${test.preconditions.length || test.data.length ? html`<div class="info" style="margin:10px 0">
          ${test.preconditions.length ? html`<strong>Preconditions</strong><ul class="bullets">${test.preconditions.map((x) => html`<li><${Inline} text=${x} /></li>`)}</ul>` : null}
          ${test.data.length ? html`<strong>Data</strong><ul class="bullets">${test.data.map((x) => html`<li><${Inline} text=${x} /></li>`)}</ul>` : null}</div>` : null}
        <h3>Steps</h3>
        ${test.steps.some(isFlow) ? html`<p class="muted small" style="margin-top:-4px">Flows are shared setup. Click <strong>Done</strong> after doing all their steps, <strong>Already done</strong> if the result was already in place, or expand one to mark single steps. A failed flow suggests <strong>Blocked</strong>.</p>` : null}
        <${ManualSteps} key=${test.id} items=${test.steps} value=${draft.steps} onChange=${(v) => setDraft({ ...draft, steps: v })} />
        <h3>Expected results</h3>
        ${test.expected.map((ex, i) => html`<div class="xrow"><span class="txt"><${Inline} text=${ex.text} /></span>
          <${Seg} value=${draft.expected[i]} options=${[['pass', 'Pass'], ['fail', 'Fail']]} onChange=${(v) => setDraft({ ...draft, expected: draft.expected.map((x, j) => (j === i ? v : x)) })} /></div>`)}
        <h3>Actual result and notes</h3>
        <textarea value=${draft.note} onInput=${(e) => setDraft({ ...draft, note: e.target.value })} placeholder="What happened? Required context for failures."></textarea>
        <h3>Screenshots</h3>
        <div class="shots">${(test.evidence || []).filter((e) => e.image).map((e) => html`<img class="zoom" src=${e.url} alt=${e.path} />`)}</div>
        <label class="btn sm" style="margin-top:6px">Attach image<input type="file" accept="image/*" style="display:none" onChange=${(e) => { upload(e.target.files[0]); e.target.value = ''; }} /></label>
        <span class="muted small"> or paste one with Ctrl+V</span>
        <h3>Result</h3>
        <div class="row">
          ${RESULT_BUTTONS.map(([v, label, key]) => html`<button class=${`btn ${v === 'pass' ? 'primary' : v === 'fail' ? 'danger' : ''}`} disabled=${saving} onClick=${() => save(v, true)} title=${`Shortcut ${key}`}>${label}</button>`)}
          ${sug ? html`<span class="muted small">Suggested from your checks: <strong>${sug}</strong></span>` : null}
          <span class="right"><a class="btn sm" href=${`#/p/${slug}/bugs/new?test=${test.id}&run=${runId}`}>Report bug</a></span>
        </div>
      </div>` : html`<${Loading} />`}
    </div>
  </${Page}>`;
}
