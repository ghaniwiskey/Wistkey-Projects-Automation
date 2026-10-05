import { html, useState, useEffect } from '../../vendor/preact-htm.mjs';
import { useResource, put, get, toast } from '../api.js';
import { Page, Kpi, Verdict, StatusBar, Counts, Empty, Loading, ErrorBox, Html, Badge, Field, RUNNER_LABEL, STATUSES, ago, dur, pct } from '../ui.js';
import { RunDialog } from '../run-dialog.js';

// Test accounts (project.yaml > auth.accounts); the server also converts the legacy auth.roles map.
const accountsOf = (p) => (p.accounts || []).map((a) => ({ ...a, roles: [...(a.roles || [])] }));
const pwLabel = (a) => (a.passwordless ? 'no password' : a.envPass ? `.env: ${a.envUser || '?'} / ${a.envPass}` : a.vaultItem ? `Vault: ${a.vaultItem}` : 'password not set');
const roleSlug = (s) => String(s).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// Role chips + input. Enter or comma adds a role; spaces become hyphens ("Approving officer" -> approving-officer).
function RolePicker({ value, onChange, suggestions }) {
  const [text, setText] = useState('');
  const roles = value || [];
  const add = (t) => {
    const parts = String(t).split(',').map(roleSlug).filter(Boolean);
    if (parts.length) onChange([...new Set([...roles, ...parts])]);
    setText('');
  };
  const rest = (suggestions || []).filter((s) => !roles.includes(s));
  return html`<div class="role-picker">
    ${roles.map((r) => html`<span class="tag">${r} <a href="javascript:void 0" onClick=${() => onChange(roles.filter((x) => x !== r))} title=${`Remove role ${r}`}>x</a></span>`)}
    <input value=${text} placeholder=${roles.length ? 'Add role' : 'e.g. standard-user'} onInput=${(e) => setText(e.target.value)}
      onKeyDown=${(e) => {
        if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(text); }
        else if (e.key === 'Backspace' && !text && roles.length) onChange(roles.slice(0, -1));
      }} onBlur=${() => text && add(text)} />
    ${rest.length ? html`<div class="chips">${rest.map((s) => html`<button type="button" class="chip" onClick=${() => add(s)}>+ ${s}</button>`)}</div>` : null}
  </div>`;
}
export function ProjectOverview({ slug, sandboxed }) {
  const { data: p, error } = useResource(`/api/projects/${slug}`, { project: slug });
  const [dialog, setDialog] = useState(null);
  if (error) return html`<${ErrorBox} error=${error} />`;
  if (!p) return html`<${Loading} />`;
  const openSuite = async (suite) => {
    const tests = await get(`/api/projects/${slug}/tests`);
    const pick = tests.filter((t) => t.tags.some((x) => suite.tags.includes(x)));
    setDialog({ tests: pick });
  };
  const maxTotal = Math.max(1, ...p.history.map((r) => r.summary.total));
  return html`<${Page} crumbs=${[{ label: 'Projects', href: '#/' }]} title=${p.name}
    sub=${html`${p.description ? html`${p.description}<br />` : null}${p.envs.map((e) => html`<span class="tag" title=${e.allowWrites ? 'writes allowed' : 'read-only'}>${e.name}${e.isDefault ? ' (default)' : ''}: ${e.baseUrl}</span>`)}`}
    actions=${html`<a class="btn" href=${`#/p/${slug}/tests/new`}>New test case</a><a class="btn" href="/report" target="_blank" rel="noopener">Overview report</a>`}>
    <div class="kpis">
      <${Kpi} label="Last run" value=${p.lastRun ? html`<${Verdict} run=${p.lastRun} />` : '-'} sub=${p.lastRun ? ago(p.lastRun.startedAt) : 'never'} />
      <${Kpi} label="Pass rate" value=${p.passRate == null ? '-' : p.passRate + '%'} sub="last 10 test runs" tone=${p.passRate == null ? '' : p.passRate >= 95 ? 'good' : p.passRate >= 80 ? 'warn' : 'bad'} />
      <${Kpi} label="Test cases" value=${p.tests} sub=${`${pct(p.automated, p.tests)}% automated`} />
      <${Kpi} label="Failing now" value=${p.failing.length} tone=${p.failing.length ? 'bad' : 'good'} />
      <${Kpi} label="Flaky" value=${p.flaky.length} tone=${p.flaky.length ? 'warn' : 'good'} />
      <${Kpi} label="Open bugs" value=${p.openBugs} tone=${p.openBugs ? 'warn' : 'good'} />
      <${Kpi} label="Lint" value=${p.lint.errors.length ? `${p.lint.errors.length} errors` : 'OK'} sub=${`${p.lint.warnings.length} warnings`} tone=${p.lint.errors.length ? 'bad' : p.lint.warnings.length ? 'warn' : 'good'} />
    </div>
    <div class="cols">
      <div>
        <div class="card section"><div class="head"><h2>Run a suite</h2></div><div class="body row">
          ${p.suites.map((s) => html`<button class="btn" onClick=${() => openSuite(s)} title=${s.description}>Run ${s.name} (${s.count})</button>`)}
          <a class="btn ghost" href=${`#/p/${slug}/tests`}>Pick tests...</a>
        </div></div>
        <h3>Insights</h3>
        <ul class="insights section">${p.insights.map((i) => html`<li class=${i.level}><${Html} html=${i.html} /></li>`)}</ul>
        <h3>Run history</h3>
        ${p.history.length ? html`<div class="card pad section"><div class="chart">${p.history.map((r) => html`<a href=${`#/p/${slug}/runs/${r.runId}`} style=${`height:${Math.max(6, (100 * r.summary.total) / maxTotal)}%`} title=${`${r.runId}: ${STATUSES.filter((k) => r.summary[k]).map((k) => `${r.summary[k]} ${k}`).join(', ')}`}>
          ${STATUSES.filter((k) => r.summary[k]).map((k) => html`<span class=${`c-${k}`} style=${`height:${(100 * r.summary[k]) / r.summary.total}%`}></span>`)}</a>`)}</div>
          <div class="muted small" style="margin-top:6px">Last ${p.history.length} test runs, oldest to newest. Click a bar to open the run.</div></div>` : html`<${Empty} title="No test runs yet">Run a suite to see history.</${Empty}>`}
        <h3>Recent runs</h3>
        ${p.recentRuns.length ? html`<div class="tablewrap section"><table class="t"><tbody>${p.recentRuns.map((r) => html`<tr>
          <td><${Verdict} run=${r} /></td><td><a href=${r.inProgress && r.runner === 'manual' ? `#/p/${slug}/manual/${r.runId}` : `#/p/${slug}/runs/${r.runId}`}>${r.suite}</a>${r.plan ? html` <span class="tag">${r.plan}</span>` : null}</td>
          <td>${RUNNER_LABEL[r.runner] || r.runner}</td><td class="nowrap">${ago(r.startedAt)}</td><td style="min-width:150px"><${StatusBar} s=${r.summary} /></td>
          <td>${r.inProgress ? null : html`<a class="btn sm" href=${`/run-report/${slug}/${r.runId}`} target="_blank" rel="noopener">Report</a>`}</td></tr>`)}</tbody></table></div>` : null}
      </div>
      <div>
        <div class="card section"><div class="head"><h2>Test plans</h2><a class="btn sm right" href=${`#/p/${slug}/plans/new`}>New plan</a></div><div class="body">
          ${p.plans.length ? p.plans.map((pl) => html`<div style="margin-bottom:10px"><div class="row"><a href=${`#/p/${slug}/plans/${pl.id}`}><strong>${pl.id}</strong> ${pl.name}</a><span class="right">${pl.ready ? html`<${Badge} status="pass" text="Ready" />` : html`<span class="tag">${pl.status}</span>`}</span></div>
            <${StatusBar} s=${pl.counts} /><div class="muted small">${pl.counts.total - pl.counts.untested}/${pl.counts.total} executed${pl.due ? `, due ${pl.due}` : ''}</div></div>`) : html`<p class="muted small">No plans yet. Plans group test runs for a release or sprint and track sign-off.</p>`}
        </div></div>
        <div class="card section"><div class="head"><h2>Playwright suite</h2></div><div class="body small"><div class="kv">
          <span class="k">Specs</span><span><code>${p.specDir}</code> (${p.specFiles} file${p.specFiles === 1 ? '' : 's'})</span>
          <span class="k">Page objects</span><code>${p.pagesDir}</code>
          <span class="k">Playwright</span><span>${(p.playwrightProjects || []).map((n) => html`<code>--project=${n}</code> `)}</span>
          <span class="k">Automated</span><span>${p.automated} of ${p.tests} test cases</span></div>
          <p class="muted" style="margin-bottom:0">A Playwright test links to a test case when its title starts with the ID: <code>${p.prefix}-001: ...</code></p></div></div>
        <div class="card section"><div class="head"><h2>Accounts</h2><a class="btn sm right" href=${`#/p/${slug}/settings`}>Edit</a></div><div class="body small">
          ${p.accounts.length ? p.accounts.map((a) => html`<div class="row" style="margin-bottom:4px"><span><strong>${a.username || '(no username)'}</strong> ${a.roles.map((r) => html`<span class="tag">${r}</span>`)}</span><span class="right muted">${pwLabel(a)}</span></div>`) : html`<p class="muted">No test accounts yet. Add them in settings.</p>`}
        </div></div>
        <div class="card section"><div class="head"><h2>Features</h2></div><div class="body">${Object.entries(p.features).map(([f, n]) => html`<div class="row small"><a href=${`#/p/${slug}/tests?feature=${encodeURIComponent(f)}`}>${f}</a><span class="right muted">${n}</span></div>`)}</div></div>
        ${p.lint.errors.length || p.lint.warnings.length ? html`<div class="card section"><div class="head"><h2>Quality checks</h2></div><div class="body small">
          ${p.lint.errors.map((e) => html`<div class="n-fail">${e}</div>`)}${p.lint.warnings.map((w) => html`<div class="n-flaky">${w}</div>`)}</div></div>` : null}
        ${p.a11y.length ? html`<div class="card section"><div class="head"><h2>Accessibility</h2></div><div class="body small">${p.a11y.map((v) => html`<div><a href=${v.helpUrl} target="_blank" rel="noopener"><code>${v.id}</code></a> ${v.impact}, ${v.count} elements</div>`)}</div></div>` : null}
      </div>
    </div>
    ${dialog ? html`<${RunDialog} project=${p} tests=${dialog.tests} onClose=${() => setDialog(null)} sandboxed=${sandboxed} />` : null}
  </${Page}>`;
}

export function ProjectSettings({ slug }) {
  const { data: p, error } = useResource(`/api/projects/${slug}`, { project: slug, kinds: ['config'] });
  const [f, setF] = useState(null);
  const [err, setErr] = useState(null);
  useEffect(() => {
    if (p && !f) setF({ name: p.name, description: p.description, defaultEnv: p.defaultEnv, envs: p.envs.map((e) => ({ name: e.name, baseUrl: e.baseUrl, allowWrites: e.allowWrites })), accounts: accountsOf(p) });
  }, [p]);
  if (error) return html`<${ErrorBox} error=${error} />`;
  if (!p || !f) return html`<${Loading} />`;
  const setEnv = (i, k, v) => setF({ ...f, envs: f.envs.map((e, j) => (j === i ? { ...e, [k]: v } : e)) });
  const setAcc = (i, k, v) => setF({ ...f, accounts: f.accounts.map((a, j) => (j === i ? { ...a, [k]: v } : a)) });
  const allRoles = [...new Set(f.accounts.flatMap((a) => a.roles))].sort();
  const shared = allRoles.filter((r) => f.accounts.filter((a) => a.roles.includes(r)).length > 1);
  const save = async () => {
    setErr(null);
    try { await put(`/api/projects/${slug}/config`, f); toast('Project settings saved', 'good'); } catch (e) { setErr(e.message); }
  };
  return html`<${Page} crumbs=${[{ label: p.name, href: `#/p/${slug}` }]} title="Project settings" actions=${html`<button class="btn primary" onClick=${save}>Save settings</button>`}>
    <${ErrorBox} error=${err} />
    <div class="cols">
      <div class="card pad">
        <${Field} label="Name"><input value=${f.name} onInput=${(e) => setF({ ...f, name: e.target.value })} /></${Field}>
        <${Field} label="Description"><input value=${f.description} onInput=${(e) => setF({ ...f, description: e.target.value })} /></${Field}>
        <span class="lbl" style="font-weight:600;font-size:13px">Environments</span>
        <table class="t" style="margin:6px 0 10px"><thead><tr><th>Default</th><th>Name</th><th>Base URL</th><th>Writes allowed</th><th></th></tr></thead><tbody>
          ${f.envs.map((e, i) => html`<tr>
            <td><input type="radio" name="defenv" checked=${f.defaultEnv === e.name} onChange=${() => setF({ ...f, defaultEnv: e.name })} /></td>
            <td><input value=${e.name} onInput=${(ev) => setEnv(i, 'name', ev.target.value)} /></td>
            <td><input value=${e.baseUrl} onInput=${(ev) => setEnv(i, 'baseUrl', ev.target.value)} /></td>
            <td><input type="checkbox" checked=${e.allowWrites} onChange=${(ev) => setEnv(i, 'allowWrites', ev.target.checked)} /></td>
            <td><button class="btn sm danger" onClick=${() => setF({ ...f, envs: f.envs.filter((_, j) => j !== i) })}>Remove</button></td></tr>`)}
        </tbody></table>
        <button class="btn sm" onClick=${() => setF({ ...f, envs: [...f.envs, { name: '', baseUrl: 'https://', allowWrites: false }] })}>Add environment</button>
        <p class="muted small">Production-like environments should stay read-only.</p>
        <span class="lbl" style="font-weight:600;font-size:13px">Accounts</span>
        <table class="t" style="margin:6px 0 10px"><thead><tr><th>Username</th><th>Roles</th><th>No password</th><th>Password manager item</th><th>Notes</th><th></th></tr></thead><tbody>
          ${f.accounts.map((a, i) => html`<tr>
            <td style="min-width:150px"><input value=${a.username} placeholder="Login ID or email" onInput=${(ev) => setAcc(i, 'username', ev.target.value)} /></td>
            <td style="min-width:220px"><${RolePicker} value=${a.roles} onChange=${(v) => setAcc(i, 'roles', v)} suggestions=${allRoles} /></td>
            <td><input type="checkbox" checked=${a.passwordless} onChange=${(ev) => setAcc(i, 'passwordless', ev.target.checked)} /></td>
            <td><input value=${a.vaultItem} disabled=${a.passwordless} placeholder=${a.passwordless ? '' : 'Vault item title'} onInput=${(ev) => setAcc(i, 'vaultItem', ev.target.value)} /></td>
            <td><input value=${a.notes} onInput=${(ev) => setAcc(i, 'notes', ev.target.value)} /></td>
            <td><button class="btn sm danger" onClick=${() => setF({ ...f, accounts: f.accounts.filter((_, j) => j !== i) })}>Remove</button></td></tr>`)}
          ${f.accounts.length ? null : html`<tr><td colspan="6" class="muted small">No accounts yet.</td></tr>`}
        </tbody></table>
        <button class="btn sm" onClick=${() => setF({ ...f, accounts: [...f.accounts, { username: '', roles: [], passwordless: false, vaultItem: '', notes: '' }] })}>Add account</button>
        ${shared.length ? html`<p class="n-flaky small">${shared.join(', ')} ${shared.length > 1 ? 'are' : 'is'} on more than one account.</p>` : null}
        <p class="muted small">One row per login. An account can have several roles: type a role and press Enter. Never type passwords here: Playwright reads <code>${`${p.prefix}_<ROLE>_USER/PASS`}</code> (named after the first role) from <code>.env</code> (gitignored), usually through <code>projects/${slug}/tests/utils/test-data.ts</code>. Suites, browsers and Playwright options live in <code>projects/${slug}/project.yaml</code>.</p>
      </div>
      <div class="card pad small">
        <div class="kv"><span class="k">Test IDs</span><span>${p.prefix}-001, ${p.prefix}-002, ...</span><span class="k">Folder</span><code>projects/${slug}</code><span class="k">Specs</span><code>${p.specDir}</code>
          <span class="k">Suites</span><span>${p.suites.map((s) => html`<div><strong>${s.name}</strong>: ${s.tags.join(', ')} (${s.count})</div>`)}</span></div>
        <h3>Quality checks</h3>
        ${p.lint.errors.length || p.lint.warnings.length ? html`${p.lint.errors.map((e) => html`<div class="n-fail">${e}</div>`)}${p.lint.warnings.map((w) => html`<div class="n-flaky">${w}</div>`)}` : html`<p class="n-pass">No problems found.</p>`}
      </div>
    </div>
  </${Page}>`;
}
