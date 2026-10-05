import { html, useState } from '../../vendor/preact-htm.mjs';
import { post, toast } from '../api.js';
import { Page, Kpi, Verdict, StatusBar, Counts, Empty, Modal, Field, ErrorBox, Badge, RUNNER_LABEL, ago, dur, pct } from '../ui.js';

export function Dashboard({ state, openNew }) {
  const projects = (state.projects || []).filter((p) => !p.error);
  const tests = projects.reduce((a, p) => a + p.tests, 0);
  const auto = projects.reduce((a, p) => a + p.automated, 0);
  const failing = projects.reduce((a, p) => a + p.failing.length, 0);
  const bugs = projects.reduce((a, p) => a + p.openBugs, 0);
  const plans = projects.reduce((a, p) => a + p.activePlans.length, 0);
  const rates = projects.filter((p) => p.passRate != null).map((p) => p.passRate);
  const rate = rates.length ? Math.round(rates.reduce((a, b) => a + b, 0) / rates.length) : null;
  const running = (state.jobs || []).filter((j) => j.status === 'running');

  return html`<${Page} title="Dashboard" sub=${html`Workspace <code>${state.workspace}</code>`}
    actions=${html`<a class="btn" href="/report" target="_blank" rel="noopener">Overview report</a><button class="btn primary" onClick=${openNew}>New project</button>`}>
    ${state.sandboxed ? html`<div class="banner">This app is running inside a sandbox: Playwright runs are disabled. Start it with "Start Test Manager.cmd" or <code>npm run tm</code> for full features.</div>` : null}
    <div class="kpis">
      <${Kpi} label="Projects" value=${projects.length} />
      <${Kpi} label="Test cases" value=${tests} sub=${`${auto} automated (${pct(auto, tests)}%)`} />
      <${Kpi} label="Pass rate" value=${rate == null ? '-' : rate + '%'} sub="average, last 10 runs" tone=${rate == null ? '' : rate >= 95 ? 'good' : rate >= 80 ? 'warn' : 'bad'} />
      <${Kpi} label="Failing now" value=${failing} tone=${failing ? 'bad' : 'good'} />
      <${Kpi} label="Open bugs" value=${bugs} tone=${bugs ? 'warn' : 'good'} />
      <${Kpi} label="Active plans" value=${plans} />
      <${Kpi} label="Playwright runs" value=${running.length} sub="running now" />
    </div>
    ${running.length ? html`<div class="card section"><div class="head"><h2>Running now</h2></div><div class="body">${running.map((j) => html`<div class="row"><${Badge} status="running" /><a href=${`#/jobs/${j.id}`}>Playwright run on ${j.project}</a><span class="muted small">started ${ago(j.startedAt)}</span></div>`)}</div></div>` : null}
    <h3>Projects</h3>
    ${projects.length ? html`<div class="projects section">${projects.map((p) => html`<${ProjectCard} p=${p} />`)}</div>` : html`<${Empty} title="No projects yet"><p>Create a project for each app under test. It gets its own folder <code>${'projects/<slug>/'}</code> with a POM skeleton and a working smoke test.</p><button class="btn primary" onClick=${openNew}>New project</button></${Empty}>`}
    <h3>Recent runs</h3>
    ${(state.recentRuns || []).length ? html`<div class="tablewrap"><table class="t"><thead><tr><th>Result</th><th>Project</th><th>Run</th><th>Runner</th><th>Started</th><th>Duration</th><th>Tests</th><th></th></tr></thead><tbody>
      ${state.recentRuns.map((r) => html`<tr>
        <td><${Verdict} run=${r} /></td>
        <td><a href=${`#/p/${r.project}`}>${r.projectName}</a></td>
        <td><a href=${r.inProgress && r.runner === 'manual' ? `#/p/${r.project}/manual/${r.runId}` : `#/p/${r.project}/runs/${r.runId}`}>${r.suite}</a>${r.plan ? html` <span class="tag">${r.plan}</span>` : null}<div class="muted small">${r.env}</div></td>
        <td>${RUNNER_LABEL[r.runner] || r.runner}</td>
        <td class="nowrap">${ago(r.startedAt)}</td>
        <td>${dur(r.durationMs)}</td>
        <td style="min-width:160px"><${StatusBar} s=${r.summary} /><${Counts} s=${r.summary} /></td>
        <td>${r.inProgress ? null : html`<a class="btn sm" href=${`/run-report/${r.project}/${r.runId}`} target="_blank" rel="noopener">Report</a>`}</td>
      </tr>`)}
    </tbody></table></div>` : html`<${Empty} title="No runs yet">Run a suite from a project page.</${Empty}>`}
  </${Page}>`;
}

function ProjectCard({ p }) {
  const last = p.lastRun;
  return html`<div class="card pcard">
    <div class="row"><h2><a href=${`#/p/${p.slug}`}>${p.name}</a></h2><span class="right">${last ? html`<${Verdict} run=${last} />` : html`<${Badge} status="never" text="No runs" />`}</span></div>
    ${p.description ? html`<div class="muted small">${p.description}</div>` : null}
    <div class="row small">${p.envs.map((e) => html`<span class="tag" title=${e.baseUrl}>${e.name}${e.isDefault ? ' *' : ''}</span>`)}</div>
    <div class="stats">
      <div><b>${p.tests}</b><span>tests</span></div>
      <div><b>${pct(p.automated, p.tests)}%</b><span>automated</span></div>
      <div><b>${p.passRate == null ? '-' : p.passRate + '%'}</b><span>pass rate</span></div>
      <div><b>${p.openBugs}</b><span>open bugs</span></div>
    </div>
    ${last ? html`<div><${StatusBar} s=${last.summary} /><div class="muted small" style="margin-top:4px">Last run ${ago(last.startedAt)} by ${RUNNER_LABEL[last.runner] || last.runner}</div></div>` : null}
    ${p.activePlans.map((pl) => html`<div class="small"><a href=${`#/p/${p.slug}/plans/${pl.id}`}>${pl.id}</a> ${pl.name}: ${pl.counts.total - pl.counts.untested}/${pl.counts.total} executed ${pl.ready ? html`<${Badge} status="pass" text="Ready" />` : null}</div>`)}
    ${p.failing.length ? html`<div class="small n-fail">Failing: ${p.failing.join(', ')}</div>` : null}
    <div class="row"><a class="btn sm" href=${`#/p/${p.slug}/tests`}>Test cases</a><a class="btn sm" href=${`#/p/${p.slug}/runs`}>Runs</a><a class="btn sm" href=${`#/p/${p.slug}/plans`}>Plans</a></div>
  </div>`;
}

export function NewProjectModal({ onClose }) {
  const [f, setF] = useState({ name: '', slug: '', url: '', env: '', prefix: '', readOnly: false, description: '' });
  const [slugEdited, setSlugEdited] = useState(false);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setF((x) => {
    const n = { ...x, [k]: v };
    if (k === 'name' && !slugEdited) n.slug = v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return n;
  });
  const submit = async () => {
    setBusy(true);
    setErr(null);
    try {
      const r = await post('/api/projects', f);
      toast(`Project ${r.slug} created (test IDs ${r.prefix}-001...)`, 'good');
      onClose();
      location.hash = `#/p/${r.slug}`;
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };
  return html`<${Modal} title="New project" onClose=${onClose} footer=${html`<button class="btn" onClick=${onClose}>Cancel</button><button class="btn primary" disabled=${busy} onClick=${submit}>Create project</button>`}>
    <${ErrorBox} error=${err} />
    <${Field} label="Name"><input value=${f.name} onInput=${(e) => set('name', e.target.value)} placeholder="Shop" /></${Field}>
    <div class="grid2">
      <${Field} label="Folder name (slug)"><input value=${f.slug} onInput=${(e) => { setSlugEdited(true); set('slug', e.target.value); }} placeholder="shop" /></${Field}>
      <${Field} label="Test ID prefix" hint="Optional, derived from the slug"><input value=${f.prefix} onInput=${(e) => set('prefix', e.target.value.toUpperCase())} placeholder="SHOP" /></${Field}>
    </div>
    <${Field} label="Base URL" hint="Where the app under test runs, for example https://staging.shop.com/"><input type="url" value=${f.url} onInput=${(e) => set('url', e.target.value)} placeholder="https://" /></${Field}>
    <div class="grid2">
      <${Field} label="Environment name" hint="Default: staging, or local for localhost. Pick it at run time with QA_ENV."><input value=${f.env} onInput=${(e) => set('env', e.target.value)} placeholder="staging" /></${Field}>
      <${Field} label="Safety"><label class="check"><input type="checkbox" checked=${f.readOnly} onChange=${(e) => set('readOnly', e.target.checked)} /> Read-only (skip tests that change data)</label></${Field}>
    </div>
    <${Field} label="Description (optional)"><input value=${f.description} onInput=${(e) => set('description', e.target.value)} placeholder="What the app does and for whom" /></${Field}>
    <div class="info small">Creates <code>projects/${f.slug || '<slug>'}/</code> from <code>projects/_template</code>: project.yaml, a POM skeleton in <code>tests/</code> (e2e, pages, fixtures, utils) and a home page smoke test <code>${f.prefix || 'PREFIX'}-001</code> you can run right away.</div>
  </${Modal}>`;
}
