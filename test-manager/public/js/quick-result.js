// "Record result" dialog: mark test cases pass/fail/blocked/skip in one step, without a step-by-step manual run.
// The server saves it as a finished manual run (suite "quick"), so history, plans and reports count it.
import { html, useState } from '../vendor/preact-htm.mjs';
import { post, toast } from './api.js';
import { Modal, Field, ErrorBox } from './ui.js';

const STATUSES = [['pass', 'Pass'], ['fail', 'Fail'], ['blocked', 'Blocked'], ['skipped', 'Skip']];

export function QuickResultDialog({ project, tests, initial, onClose, onDone }) {
  const [status, setStatus] = useState(initial || 'pass');
  const [env, setEnv] = useState(project.defaultEnv);
  const [note, setNote] = useState('');
  const [bug, setBug] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const n = tests.length;

  const save = async () => {
    if (status === 'fail' && !note.trim()) { setErr('Add a note for a failure: what happened instead of the expected result.'); return; }
    setBusy(true);
    setErr(null);
    try {
      const r = await post(`/api/projects/${project.slug}/results`, {
        ids: tests.map((t) => t.id), status, env, note, bug: status === 'fail' ? bug : '', tester: localStorage.getItem('qa.tester') || '',
      });
      toast(`${n === 1 ? tests[0].id : `${n} test cases`} marked ${status}`, status === 'pass' ? 'good' : status === 'fail' ? 'error' : 'info');
      onClose();
      if (onDone) onDone(r);
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };

  return html`<${Modal} title=${n === 1 ? `Record result for ${tests[0].id}` : `Record result for ${n} test cases`} onClose=${onClose}
    footer=${html`<button class="btn" onClick=${onClose}>Cancel</button><button class=${`btn ${status === 'fail' ? 'danger' : 'primary'}`} disabled=${busy} onClick=${save}>${busy ? 'Saving...' : `Save as ${status}`}</button>`}>
    <${ErrorBox} error=${err} />
    <div style="margin-bottom:12px"><div class="small" style="font-weight:600;margin-bottom:4px">Result</div>
      <span class="seg" role="group" aria-label="Result">${STATUSES.map(([v, label]) => html`<button type="button" aria-pressed=${status === v} class=${status === v ? `on-${v}` : ''} onClick=${() => setStatus(v)}>${label}</button>`)}</span></div>
    <${Field} label="Environment"><select value=${env} onChange=${(e) => setEnv(e.target.value)}>${project.envs.map((e) => html`<option value=${e.name}>${e.name}${e.isDefault ? ' (default)' : ''}</option>`)}</select></${Field}>
    <${Field} label=${status === 'fail' ? 'What happened (required)' : 'Note (optional)'}>
      <textarea value=${note} onInput=${(e) => setNote(e.target.value)} placeholder=${status === 'fail' ? 'Actual result vs. expected' : status === 'blocked' ? 'What blocked it (login down, data missing...)' : ''}></textarea>
    </${Field}>
    ${status === 'fail' ? html`<${Field} label="Linked bug (optional)" hint="For example BUG-004. Without one the failure is saved as untriaged."><input value=${bug} onInput=${(e) => setBug(e.target.value)} placeholder="BUG-..." /></${Field}>` : null}
    <p class="muted small">Saved as a finished manual run, so it shows in history, Last result, plans and reports. To check each step and attach screenshots, use Run... > Manual instead.</p>
    ${n > 1 ? html`<details><summary class="small muted">Selected tests</summary><p class="small">${tests.map((t) => t.id).join(', ')}</p></details>` : null}
  </${Modal}>`;
}
