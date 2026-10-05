// "Run tests" dialog: the project's Playwright POM suite (projects/<slug>/tests/e2e) or manual execution.
import { html, useState } from '../vendor/preact-htm.mjs';
import { post, toast } from './api.js';
import { Modal, Field, ErrorBox } from './ui.js';

export async function copyText(text) {
  try { await navigator.clipboard.writeText(text); toast('Copied to clipboard', 'good'); } catch { toast('Copy failed; select the text and copy it manually', 'error'); }
}

export function RunDialog({ project, tests, plan, onClose, initial, sandboxed }) {
  // Playwright runs the test cases that have a Playwright test titled "<ID>: ..." in the POM suite.
  const automated = tests.filter((t) => (t.spec !== undefined ? !!t.spec : t.automated));
  const [mode, setMode] = useState(initial || (automated.length ? 'playwright' : 'manual'));
  const [env, setEnv] = useState(project.defaultEnv);
  const [headed, setHeaded] = useState(false);
  const [tester, setTester] = useState(localStorage.getItem('qa.tester') || '');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const envInfo = project.envs.find((e) => e.name === env);

  const start = async () => {
    setBusy(true);
    setErr(null);
    try {
      if (mode === 'playwright') {
        const job = await post('/api/jobs/playwright', { project: project.slug, env, ids: automated.map((t) => t.id), plan, headed });
        toast(`Playwright run started: ${automated.length} test(s)`, 'good');
        onClose();
        location.hash = `#/jobs/${job.id}`;
      } else {
        localStorage.setItem('qa.tester', tester);
        const r = await post(`/api/projects/${project.slug}/manual-runs`, { ids: tests.map((t) => t.id), env, plan, tester });
        onClose();
        location.hash = `#/p/${project.slug}/manual/${r.runId}`;
      }
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  const tab = (k, label) => html`<button class=${mode === k ? 'on' : ''} onClick=${() => setMode(k)}>${label}</button>`;
  const canStart = mode !== 'playwright' || automated.length > 0;
  const specFiles = [...new Set(automated.map((t) => t.spec).filter(Boolean))];
  return html`<${Modal} title=${`Run ${tests.length} test case${tests.length === 1 ? '' : 's'}`} onClose=${onClose}
    footer=${html`<button class="btn" onClick=${onClose}>Cancel</button><button class="btn primary" disabled=${busy || !canStart} onClick=${start}>${busy ? 'Starting...' : mode === 'playwright' ? 'Start Playwright run' : 'Start manual run'}</button>`}>
    <div class="tabs">${tab('playwright', 'Playwright')}${tab('manual', 'Manual')}</div>
    <${ErrorBox} error=${err} />
    ${mode === 'playwright' ? html`<div>
      <p class="muted small">Runs <code>playwright test ${(project.playwrightProjects || [project.slug]).map((n) => `--project=${n}`).join(' ')}</code> with live progress, screenshots, videos and traces on failure, on the environment chosen below (<code>QA_ENV</code>).</p>
      ${automated.length < tests.length ? html`<div class="banner">${automated.length} of ${tests.length} selected tests have a Playwright test. ${automated.length ? 'Only those will run.' : `Choose Manual for the others, or automate them in ${project.specDir || 'tests/e2e'}.`}</div>` : null}
      ${specFiles.length ? html`<p class="small muted">Spec files: ${specFiles.map((f) => html`<code>${f}</code> `)}</p>` : null}
      ${sandboxed ? html`<div class="banner">This app is running inside a sandbox where browsers cannot start. Start it with "Start Test Manager.cmd" or <code>npm run tm</code> to run Playwright.</div>` : null}
      <label class="check"><input type="checkbox" checked=${headed} onChange=${(e) => setHeaded(e.target.checked)} /> Show the browser window (headed)</label>
    </div>` : null}
    ${mode === 'manual' ? html`<div>
      <p class="muted small">You step through each test and record the result of every step and expected result, with notes and screenshots.</p>
      <${Field} label="Tester name (optional)"><input value=${tester} onInput=${(e) => setTester(e.target.value)} placeholder="Your name" /></${Field}>
    </div>` : null}
    <${Field} label="Environment" hint=${envInfo ? `${envInfo.baseUrl}${envInfo.allowWrites ? '' : ' (read-only: tests tagged @writes are skipped)'}` : ''}>
      <select value=${env} onChange=${(e) => setEnv(e.target.value)}>${project.envs.map((e) => html`<option value=${e.name}>${e.name}${e.isDefault ? ' (default)' : ''}</option>`)}</select>
    </${Field}>
    ${plan ? html`<p class="small muted">Results will count toward test plan <strong>${plan}</strong>.</p>` : null}
    <details><summary class="small muted">Selected tests</summary><p class="small">${tests.map((t) => t.id).join(', ')}</p></details>
  </${Modal}>`;
}