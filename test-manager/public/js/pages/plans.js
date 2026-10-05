import { html, useState, useEffect, useMemo } from '../../vendor/preact-htm.mjs';
import { useResource, post, put, toast } from '../api.js';
import { Page, Badge, Prio, Kind, Verdict, StatusBar, Counts, Empty, Loading, ErrorBox, Field, TagPicker, Kpi, RUNNER_LABEL, ago, pct, fmtDate } from '../ui.js';
import { RunDialog } from '../run-dialog.js';

const readiness = (pl) => (pl.ready ? html`<${Badge} status="pass" text="Ready" />` : pl.counts.fail || pl.counts.blocked ? html`<${Badge} status="fail" text="Blocked" />` : html`<${Badge} status="untested" text="Not ready" />`);
const signoffBadge = (so) => html`<${Badge} status=${so.status === 'approved' ? 'pass' : so.status === 'rejected' ? 'fail' : 'untested'} text=${`Sign-off: ${so.status}`} />`;

export function PlanList({ slug }) {
  const { data: plans, error } = useResource(`/api/projects/${slug}/plans`, { project: slug });
  const { data: p } = useResource(`/api/projects/${slug}`, { project: slug });
  if (error) return html`<${ErrorBox} error=${error} />`;
  if (!plans || !p) return html`<${Loading} />`;
  return html`<${Page} crumbs=${[{ label: p.name, href: `#/p/${slug}` }]} title="Test plans" sub="Group test runs for a release or sprint, track progress and blockers, and sign off."
    actions=${html`<a class="btn primary" href=${`#/p/${slug}/plans/new`}>New plan</a>`}>
    ${plans.length ? html`<div class="tablewrap"><table class="t"><thead><tr><th>Plan</th><th>Release</th><th>Status</th><th>Env</th><th>Progress</th><th>Readiness</th><th>Sign-off</th><th>Due</th></tr></thead><tbody>
      ${plans.map((pl) => html`<tr>
        <td><a href=${`#/p/${slug}/plans/${pl.id}`}><strong>${pl.id}</strong> ${pl.name}</a></td>
        <td>${pl.release || '-'}</td><td><span class="tag">${pl.status}</span></td><td>${pl.env || p.defaultEnv}</td>
        <td style="min-width:200px"><${StatusBar} s=${pl.counts} /><div class="muted small">${pl.counts.total - pl.counts.untested}/${pl.counts.total} executed: ${pl.counts.pass} pass, ${pl.counts.fail} fail, ${pl.counts.untested} untested</div></td>
        <td>${readiness(pl)}</td><td>${pl.signoff.status}${pl.signoff.by ? html`<div class="muted small">${pl.signoff.by}</div>` : null}</td><td class="nowrap">${pl.due || '-'}</td>
      </tr>`)}</tbody></table></div>`
    : html`<${Empty} title="No test plans yet"><p>A plan picks the tests for a release (by suite tags or by hand). Every run started from the plan counts toward its progress.</p><a class="btn primary" href=${`#/p/${slug}/plans/new`}>New plan</a></${Empty}>`}
  </${Page}>`;
}

export function PlanDetail({ slug, planId, sandboxed }) {
  const { data: pl, error } = useResource(`/api/projects/${slug}/plans/${planId}`, { project: slug });
  const { data: p } = useResource(`/api/projects/${slug}`, { project: slug });
  const [dialog, setDialog] = useState(null);
  const [so, setSo] = useState({ by: localStorage.getItem('qa.tester') || '', note: '' });
  if (error) return html`<${ErrorBox} error=${error} />`;
  if (!pl || !p) return html`<${Loading} />`;
  const c = pl.counts;
  const remaining = pl.tests.filter((t) => !t.inPlan || ['fail', 'blocked'].includes(t.inPlan.status));
  const setStatus = async (status) => { try { await put(`/api/projects/${slug}/plans/${planId}`, { status }); toast(`Plan marked ${status}`, 'good'); } catch (e) { toast(e.message, 'error'); } };
  const signoff = async (status) => {
    if (status !== 'pending' && !so.by.trim()) { toast('Enter your name to sign off', 'error'); return; }
    try { await put(`/api/projects/${slug}/plans/${planId}`, { signoff: { status, by: so.by, note: so.note } }); toast(`Sign-off: ${status}`, 'good'); } catch (e) { toast(e.message, 'error'); }
  };
  const runSet = (tests) => setDialog({ tests: tests.map((t) => ({ id: t.id, title: t.title, automated: t.automated, spec: t.spec || null })) });
  return html`<${Page} crumbs=${[{ label: p.name, href: `#/p/${slug}` }, { label: 'Test plans', href: `#/p/${slug}/plans` }]}
    title=${html`<span class="muted">${pl.id}</span> ${pl.name}`} sub=${html`${pl.release ? `Release ${pl.release}. ` : ''}Env ${pl.env || p.defaultEnv}. ${pl.start || pl.due ? `${pl.start || '?'} to ${pl.due || '?'}. ` : ''}${pl.owner ? `Owner ${pl.owner}. ` : ''}<span class="tag">${pl.status}</span> ${readiness(pl)} ${signoffBadge(pl.signoff)}`}
    actions=${html`<button class="btn blue" disabled=${!remaining.length} onClick=${() => runSet(remaining)}>Run remaining (${remaining.length})</button>
      <button class="btn" onClick=${() => runSet(pl.tests)}>Run all (${pl.tests.length})</button><a class="btn" href=${`#/p/${slug}/plans/${planId}/edit`}>Edit plan</a>`}>
    ${pl.description ? html`<p>${pl.description}</p>` : null}
    <div class="kpis">
      <${Kpi} label="Executed" value=${`${pct(c.total - c.untested, c.total)}%`} sub=${`${c.total - c.untested} of ${c.total}`} />
      <${Kpi} label="Passed" value=${c.pass + c.flaky} tone="good" />
      <${Kpi} label="Failed" value=${c.fail} tone=${c.fail ? 'bad' : 'good'} />
      <${Kpi} label="Blocked" value=${c.blocked} tone=${c.blocked ? 'bad' : ''} />
      <${Kpi} label="Untested" value=${c.untested} tone=${c.untested ? 'warn' : 'good'} />
      <${Kpi} label="Open bugs" value=${pl.bugs.length} tone=${pl.bugs.length ? 'warn' : 'good'} sub=${pl.bugs.join(', ')} />
    </div>
    <div class="card pad section"><${StatusBar} s=${c} /></div>
    <div class="cols">
      <div>
        <h3>Tests in this plan</h3>
        <div class="tablewrap"><table class="t"><thead><tr><th>ID</th><th>Test</th><th>Priority</th><th>Type</th><th>Result in plan</th><th>Latest overall</th></tr></thead><tbody>
          ${pl.tests.map((t) => html`<tr><td class="nowrap"><a href=${`#/p/${slug}/tests/${t.id}`}><strong>${t.id}</strong></a></td><td>${t.title}<div class="muted small">${t.feature}</div></td>
            <td><${Prio} p=${t.priority} /></td><td><${Kind} automated=${t.automated} /></td>
            <td>${t.inPlan ? html`<a href=${`#/p/${slug}/runs/${t.inPlan.runId}?test=${t.id}`}><${Badge} status=${t.inPlan.status} /></a><div class="muted small">${RUNNER_LABEL[t.inPlan.runner] || t.inPlan.runner}, ${ago(t.inPlan.at)}</div>` : html`<${Badge} status="untested" />`}</td>
            <td><${Badge} status=${t.lastStatus} /></td></tr>`)}
        </tbody></table></div>
        <h3>Runs in this plan</h3>
        ${pl.runs.length ? html`<div class="tablewrap"><table class="t"><tbody>${pl.runs.map((r) => html`<tr><td><${Verdict} run=${r} /></td>
          <td><a href=${r.inProgress && r.runner === 'manual' ? `#/p/${slug}/manual/${r.runId}` : `#/p/${slug}/runs/${r.runId}`}>${r.suite}</a><div class="muted small">${r.runId}</div></td>
          <td>${RUNNER_LABEL[r.runner] || r.runner}</td><td class="nowrap">${ago(r.startedAt)}</td><td style="min-width:150px"><${StatusBar} s=${r.summary} /></td>
          <td>${r.inProgress ? null : html`<a class="btn sm" href=${`/run-report/${slug}/${r.runId}`} target="_blank" rel="noopener">Test report</a>`}</td></tr>`)}</tbody></table></div>`
        : html`<p class="muted small">No runs yet. Use "Run remaining" to start one; it counts toward this plan.</p>`}
      </div>
      <div>
        <div class="card section"><div class="head"><h2>Sign-off</h2></div><div class="body">
          <p class="small">${signoffBadge(pl.signoff)} ${pl.signoff.by ? html`by <strong>${pl.signoff.by}</strong>` : ''} ${pl.signoff.at ? fmtDate(pl.signoff.at) : ''}</p>
          ${pl.signoff.note ? html`<p class="small muted">${pl.signoff.note}</p>` : null}
          ${!pl.ready ? html`<div class="banner small">Not ready: ${c.untested} untested, ${c.fail} failed, ${c.blocked} blocked.</div>` : null}
          <${Field} label="Your name"><input value=${so.by} onInput=${(e) => setSo({ ...so, by: e.target.value })} /></${Field}>
          <${Field} label="Note"><textarea rows="2" value=${so.note} onInput=${(e) => setSo({ ...so, note: e.target.value })} placeholder="Known issues accepted for this release, etc."></textarea></${Field}>
          <div class="row"><button class="btn primary" onClick=${() => signoff('approved')}>Approve</button><button class="btn danger" onClick=${() => signoff('rejected')}>Reject</button><button class="btn ghost" onClick=${() => signoff('pending')}>Reset</button></div>
        </div></div>
        <div class="card section"><div class="head"><h2>Plan status</h2></div><div class="body row">
          ${['draft', 'active', 'done'].map((s) => html`<button class=${`btn sm ${pl.status === s ? 'on' : ''}`} onClick=${() => setStatus(s)}>${s}</button>`)}
        </div></div>
        <div class="card section"><div class="head"><h2>Scope</h2></div><div class="body small">
          <div>Tags: ${pl.scope.tags.length ? pl.scope.tags.map((t) => html`<span class="tag">${t}</span>`) : '-'}</div>
          <div>Extra tests: ${pl.scope.tests.join(', ') || '-'}</div><div>Excluded: ${pl.scope.exclude.join(', ') || '-'}</div>
          <div class="muted" style="margin-top:6px">File <code>${pl.file}</code></div></div></div>
      </div>
    </div>
    ${dialog ? html`<${RunDialog} project=${p} tests=${dialog.tests} plan=${planId} onClose=${() => setDialog(null)} sandboxed=${sandboxed} />` : null}
  </${Page}>`;
}

export function PlanEditor({ slug, planId }) {
  const isNew = !planId;
  const existing = useResource(isNew ? null : `/api/projects/${slug}/plans/${planId}`);
  const { data: p } = useResource(`/api/projects/${slug}`, { project: slug });
  const { data: tests } = useResource(`/api/projects/${slug}/tests`, { project: slug, kinds: ['tests'] });
  const [f, setF] = useState(isNew ? { name: '', release: '', env: '', status: 'active', start: new Date().toISOString().slice(0, 10), due: '', owner: '', description: '', scope: { tags: [], tests: [], exclude: [] } } : null);
  const [err, setErr] = useState(null);
  const [q, setQ] = useState('');
  useEffect(() => {
    if (!isNew && existing.data && !f) {
      const x = existing.data;
      setF({ name: x.name, release: x.release, env: x.env, status: x.status, start: x.start, due: x.due, owner: x.owner, description: x.description, scope: x.scope });
    }
  }, [existing.data]);
  const inScope = useMemo(() => {
    if (!f || !tests) return [];
    const tags = new Set(f.scope.tags);
    return tests.filter((t) => !f.scope.exclude.includes(t.id) && (f.scope.tests.includes(t.id) || t.tags.some((x) => tags.has(x))));
  }, [f, tests]);
  if (!p || !f || !tests) return html`<${Loading} />`;
  const set = (k, v) => setF({ ...f, [k]: v });
  const setScope = (k, v) => setF({ ...f, scope: { ...f.scope, [k]: v } });
  const toggleTest = (id) => {
    const on = inScope.some((t) => t.id === id);
    const byTag = tests.find((t) => t.id === id).tags.some((x) => f.scope.tags.includes(x));
    if (on) setF({ ...f, scope: { ...f.scope, tests: f.scope.tests.filter((x) => x !== id), exclude: byTag ? [...new Set([...f.scope.exclude, id])] : f.scope.exclude } });
    else setF({ ...f, scope: { ...f.scope, exclude: f.scope.exclude.filter((x) => x !== id), tests: byTag ? f.scope.tests : [...new Set([...f.scope.tests, id])] } });
  };
  const save = async () => {
    setErr(null);
    try {
      const r = isNew ? await post(`/api/projects/${slug}/plans`, f) : await put(`/api/projects/${slug}/plans/${planId}`, f);
      toast('Plan saved', 'good');
      location.hash = `#/p/${slug}/plans/${r.id}`;
    } catch (e) { setErr(e.message); }
  };
  const shown = tests.filter((t) => !q || `${t.id} ${t.title} ${t.tags.join(' ')}`.toLowerCase().includes(q.toLowerCase()));
  return html`<${Page} crumbs=${[{ label: p.name, href: `#/p/${slug}` }, { label: 'Test plans', href: `#/p/${slug}/plans` }]} title=${isNew ? 'New test plan' : `Edit ${planId}`}
    actions=${html`<a class="btn" href=${isNew ? `#/p/${slug}/plans` : `#/p/${slug}/plans/${planId}`}>Cancel</a><button class="btn primary" onClick=${save}>Save plan</button>`}>
    <${ErrorBox} error=${err} />
    <div class="cols wide-right">
      <div class="card pad">
        <${Field} label="Name"><input value=${f.name} onInput=${(e) => set('name', e.target.value)} placeholder="Release 2.3 regression" /></${Field}>
        <div class="grid2">
          <${Field} label="Release or sprint"><input value=${f.release} onInput=${(e) => set('release', e.target.value)} placeholder="2.3.0" /></${Field}>
          <${Field} label="Environment"><select value=${f.env} onChange=${(e) => set('env', e.target.value)}><option value="">Project default (${p.defaultEnv})</option>${p.envs.map((e) => html`<option value=${e.name}>${e.name}</option>`)}</select></${Field}>
          <${Field} label="Start"><input type="date" value=${f.start} onInput=${(e) => set('start', e.target.value)} /></${Field}>
          <${Field} label="Due"><input type="date" value=${f.due} onInput=${(e) => set('due', e.target.value)} /></${Field}>
          <${Field} label="Owner"><input value=${f.owner} onInput=${(e) => set('owner', e.target.value)} /></${Field}>
          <${Field} label="Status"><select value=${f.status} onChange=${(e) => set('status', e.target.value)}><option value="draft">draft</option><option value="active">active</option><option value="done">done</option></select></${Field}>
        </div>
        <${Field} label="Description"><textarea value=${f.description} onInput=${(e) => set('description', e.target.value)}></textarea></${Field}>
        <${Field} label="Include tests with these tags" hint=${`Suites: ${p.suites.map((s) => `${s.name} = ${s.tags.join('+')}`).join('; ')}`}>
          <${TagPicker} value=${f.scope.tags} onChange=${(v) => setScope('tags', v)} suggestions=${Object.keys(p.tags)} /></${Field}>
      </div>
      <div class="card pad">
        <div class="row"><strong>${inScope.length} tests in scope</strong><input type="search" class="right" style="max-width:220px" placeholder="Filter" value=${q} onInput=${(e) => setQ(e.target.value)} /></div>
        <p class="muted small">Tick tests to add or remove them individually; tags cover the rest.</p>
        <div style="max-height:520px;overflow:auto">${shown.map((t) => html`<label class="check" style="display:flex;padding:4px 0;border-bottom:1px dashed #eaeef2">
          <input type="checkbox" checked=${inScope.some((x) => x.id === t.id)} onChange=${() => toggleTest(t.id)} />
          <strong>${t.id}</strong> <span class="grow">${t.title}</span> <${Prio} p=${t.priority} /></label>`)}</div>
      </div>
    </div>
  </${Page}>`;
}
