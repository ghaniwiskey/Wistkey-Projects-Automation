import { html, render, useState, useEffect } from '../vendor/preact-htm.mjs';
import { connect, onEvent, useResource, toast } from './api.js';
import { Toasts, Lightbox, Loading, ErrorBox, Badge } from './ui.js';
import { Dashboard, NewProjectModal } from './pages/dashboard.js';
import { ProjectOverview, ProjectSettings } from './pages/project.js';
import { TestList, TestDetail, TestEditor } from './pages/tests.js';
import { RunList, RunDetail, JobConsole } from './pages/runs.js';
import { ManualRun } from './pages/manual.js';
import { PlanList, PlanDetail, PlanEditor } from './pages/plans.js';
import { BugList, BugDetail, BugEditor } from './pages/bugs.js';

function parseRoute() {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [p, qs] = raw.split('?');
  return { seg: p.split('/').filter(Boolean).map(decodeURIComponent), query: Object.fromEntries(new URLSearchParams(qs || '')), raw };
}

function Sidebar({ state, route, connected, openNew }) {
  const slug = route.seg[0] === 'p' ? route.seg[1] : null;
  const sub = route.seg[2] || '';
  const projects = (state && state.projects) || [];
  const running = ((state && state.jobs) || []).filter((j) => j.status === 'running');
  const on = (cond) => (cond ? 'on' : '');
  return html`<nav class="side">
    <div class="brand"><span class="logo"><svg width="14" height="14" viewBox="0 0 32 32"><path d="M8 16.5l5 5L24 10.5" stroke="white" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" /></svg></span>
      Test Manager<span class=${`live ${connected ? '' : 'off'}`} title=${connected ? 'Live: updates appear automatically' : 'Disconnected: reconnecting...'}></span></div>
    <a href="#/" class=${on(!route.seg.length)}>Dashboard</a>
    ${running.map((j) => html`<a href=${`#/jobs/${j.id}`} class=${on(route.seg[1] === j.id)}>Running: ${j.project}<span class="count">live</span></a>`)}
    <div class="nav-head">Projects <button onClick=${openNew} title="New project">+ New</button></div>
    ${projects.map((p) => html`<div>
      <a href=${`#/p/${p.slug}`} class=${on(slug === p.slug && !sub)}>${p.name}<span class="count">${p.tests}</span></a>
      ${slug === p.slug ? html`<div class="sub">
        <a href=${`#/p/${p.slug}/tests`} class=${on(sub === 'tests')}>Test cases<span class="count">${p.tests}</span></a>
        <a href=${`#/p/${p.slug}/runs`} class=${on(sub === 'runs' || sub === 'manual')}>Runs<span class="count">${p.runs}</span></a>
        <a href=${`#/p/${p.slug}/plans`} class=${on(sub === 'plans')}>Test plans<span class="count">${p.activePlans.length || ''}</span></a>
        <a href=${`#/p/${p.slug}/bugs`} class=${on(sub === 'bugs')}>Bugs<span class="count">${p.openBugs || ''}</span></a>
        <a href=${`#/p/${p.slug}/settings`} class=${on(sub === 'settings')}>Settings</a>
      </div>` : null}
    </div>`)}
    <div class="foot">
      One folder per app: <code>${'projects/<slug>/'}</code> holds its Playwright POM suite (<code>tests/</code>) and its test cases, plans, bugs and runs. Edits on disk show up here live.
    </div>
  </nav>`;
}

function Content({ route, state, openNew }) {
  const { seg, query } = route;
  const sandboxed = !!state.sandboxed;
  if (!seg.length) return html`<${Dashboard} state=${state} openNew=${openNew} />`;
  if (seg[0] === 'jobs' && seg[1]) return html`<${JobConsole} id=${seg[1]} />`;
  if (seg[0] === 'p' && seg[1]) {
    const slug = seg[1];
    const [, , a, b, c] = seg;
    if (!a) return html`<${ProjectOverview} slug=${slug} sandboxed=${sandboxed} />`;
    if (a === 'tests') {
      if (!b) return html`<${TestList} slug=${slug} query=${query} sandboxed=${sandboxed} />`;
      if (b === 'new') return html`<${TestEditor} key="new" slug=${slug} query=${query} />`;
      if (c === 'edit') return html`<${TestEditor} key=${`edit-${b}`} slug=${slug} id=${b} query=${query} />`;
      return html`<${TestDetail} slug=${slug} id=${b} sandboxed=${sandboxed} />`;
    }
    if (a === 'runs') return b ? html`<${RunDetail} slug=${slug} runId=${b} query=${query} sandboxed=${sandboxed} />` : html`<${RunList} slug=${slug} state=${state} sandboxed=${sandboxed} />`;
    if (a === 'manual' && b) return html`<${ManualRun} key=${b} slug=${slug} runId=${b} />`;
    if (a === 'plans') {
      if (!b) return html`<${PlanList} slug=${slug} />`;
      if (b === 'new') return html`<${PlanEditor} key="new" slug=${slug} />`;
      if (c === 'edit') return html`<${PlanEditor} key=${`edit-${b}`} slug=${slug} planId=${b} />`;
      return html`<${PlanDetail} slug=${slug} planId=${b} sandboxed=${sandboxed} />`;
    }
    if (a === 'bugs') {
      if (!b) return html`<${BugList} slug=${slug} />`;
      if (b === 'new') return html`<${BugEditor} slug=${slug} query=${query} />`;
      return html`<${BugDetail} slug=${slug} bugId=${b} />`;
    }
    if (a === 'settings') return html`<${ProjectSettings} slug=${slug} />`;
  }
  return html`<${ErrorBox} error=${`Page not found: ${route.raw}`} />`;
}

function App() {
  const [route, setRoute] = useState(parseRoute());
  const [connected, setConnected] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const { data: state, error } = useResource('/api/state', { jobs: true });
  useEffect(() => {
    const onHash = () => { setRoute(parseRoute()); window.scrollTo(0, 0); };
    addEventListener('hashchange', onHash);
    connect();
    const off = onEvent((type, ev) => {
      if (type === 'status') setConnected(ev.connected);
      if (type === 'change' && (ev.kinds || []).includes('tests')) toast(`Test cases updated in ${ev.projects.join(', ')}`);
      if (type === 'change' && (ev.kinds || []).includes('specs')) toast('Playwright specs or page objects changed');
      if (type === 'job' && ev.status !== 'running' && ev.finishedAt) toast(`Playwright run ${ev.status} (${ev.project})`, ev.status === 'passed' ? 'good' : 'error');
    });
    return () => { removeEventListener('hashchange', onHash); off(); };
  }, []);
  if (error && !state) return html`<div class="main"><${ErrorBox} error=${`Cannot reach the Test Manager server: ${error}`} /></div>`;
  if (!state) return html`<div class="main"><${Loading} /></div>`;
  return html`<div class="layout">
    <${Sidebar} state=${state} route=${route} connected=${connected} openNew=${() => setShowNew(true)} />
    <main class="main"><${Content} route=${route} state=${state} openNew=${() => setShowNew(true)} /></main>
    ${showNew ? html`<${NewProjectModal} onClose=${() => setShowNew(false)} />` : null}
    <${Toasts} /><${Lightbox} />
  </div>`;
}

const mount = document.getElementById('app');
mount.textContent = ''; // remove the static "Loading..." placeholder before Preact takes over
render(html`<${App} />`, mount);
