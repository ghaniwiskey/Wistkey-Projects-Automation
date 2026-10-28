import { html, useState, useEffect, useMemo } from '../../vendor/preact-htm.mjs';
import { useResource, post, put, del, toast } from '../api.js';
import { Page, Badge, Prio, Tags, Kind, Dots, Empty, Loading, ErrorBox, Field, ListEditor, TagPicker, Checks, Inline, Html, RUNNER_LABEL, ago, dur, fmtDate, StepTree } from '../ui.js';
import { RunDialog } from '../run-dialog.js';
import { QuickResultDialog } from '../quick-result.js';

const PAGE = 300; // rows rendered at a time, so very large projects stay responsive
const STATUS_FILTERS = [['all', 'Any result'], ['pass', 'Pass'], ['fail', 'Fail'], ['flaky', 'Flaky'], ['blocked', 'Blocked'], ['skipped', 'Skipped'], ['never', 'Not run']];

export function TestList({ slug, query, sandboxed }) {
  const { data: tests, error } = useResource(`/api/projects/${slug}/tests`, { project: slug, kinds: ['tests', 'specs', 'runs', 'bugs'] });
  const { data: p } = useResource(`/api/projects/${slug}`, { project: slug });
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [prio, setPrio] = useState('all');
  const [kind, setKind] = useState('all');
  const [tag, setTag] = useState('');
  const [sel, setSel] = useState(new Set());
  const [dialog, setDialog] = useState(null);
  const [mark, setMark] = useState(null);
  const [limit, setLimit] = useState(PAGE);
  const feature = query.feature || '';
  useEffect(() => setLimit(PAGE), [feature, status, prio, kind, tag, q]);
  const rows = useMemo(() => (tests || []).filter((t) => (!feature || t.feature === feature)
    && (status === 'all' || t.lastStatus === status) && (prio === 'all' || t.priority === prio)
    && (kind === 'all' || (kind === 'auto') === t.automated) && (!tag || t.tags.includes(tag))
    && (!q || `${t.id} ${t.title} ${t.feature} ${t.tags.join(' ')}`.toLowerCase().includes(q.toLowerCase()))), [tests, feature, status, prio, kind, tag, q]);
  if (error) return html`<${ErrorBox} error=${error} />`;
  if (!tests || !p) return html`<${Loading} />`;
  const features = {};
  for (const t of tests) features[t.feature] = (features[t.feature] || 0) + 1;
  const tagCounts = {};
  for (const t of tests) for (const x of t.tags) tagCounts[x] = (tagCounts[x] || 0) + 1;
  const toggle = (id) => setSel((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const allSel = rows.length && rows.every((t) => sel.has(t.id));
  const selected = tests.filter((t) => sel.has(t.id));
  const featLink = (f) => `#/p/${slug}/tests${f ? `?feature=${encodeURIComponent(f)}` : ''}`;
  return html`<${Page} crumbs=${[{ label: p.name, href: `#/p/${slug}` }]} title="Test cases" sub=${`${tests.length} test cases, ${tests.filter((t) => t.automated).length} automated. Files in projects/${slug}/cases/`}
    actions=${html`<button class="btn" disabled=${!rows.length} onClick=${() => setDialog({ tests: rows })}>Run filtered (${rows.length})</button><a class="btn primary" href=${`#/p/${slug}/tests/new${feature ? `?feature=${encodeURIComponent(feature)}` : ''}`}>New test case</a>`}>
    <div class="listcols">
      <div class="facet">
        <h4>Features</h4>
        <a class=${!feature ? 'on' : ''} href=${featLink('')}>All <span>${tests.length}</span></a>
        ${Object.entries(features).sort().map(([f, n]) => html`<a class=${feature === f ? 'on' : ''} href=${featLink(f)}>${f} <span>${n}</span></a>`)}
        <h4>Tags</h4>
        <a class=${!tag ? 'on' : ''} href="javascript:void 0" onClick=${() => setTag('')}>Any tag</a>
        ${Object.entries(tagCounts).sort().map(([x, n]) => html`<a class=${tag === x ? 'on' : ''} href="javascript:void 0" onClick=${() => setTag(x)}>${x} <span>${n}</span></a>`)}
      </div>
      <div>
        <div class="toolbar">
          <input type="search" placeholder="Search ID, title, tag" value=${q} onInput=${(e) => setQ(e.target.value)} />
          <select value=${status} onChange=${(e) => setStatus(e.target.value)}>${STATUS_FILTERS.map(([v, l]) => html`<option value=${v}>${l}</option>`)}</select>
          <select value=${prio} onChange=${(e) => setPrio(e.target.value)}><option value="all">Any priority</option>${['P0', 'P1', 'P2', 'P3'].map((x) => html`<option value=${x}>${x}</option>`)}</select>
          <select value=${kind} onChange=${(e) => setKind(e.target.value)}><option value="all">Automated or manual</option><option value="auto">Automated</option><option value="manual">Manual only</option></select>
          <span class="muted small right">${rows.length} shown</span>
        </div>
        ${selected.length ? html`<div class="selbar"><strong>${selected.length} selected</strong>
          <button class="btn sm blue" onClick=${() => setDialog({ tests: selected })}>Run selected...</button>
          <button class="btn sm" onClick=${() => setMark({ tests: selected, status: 'pass' })}>Mark pass</button>
          <button class="btn sm" onClick=${() => setMark({ tests: selected, status: 'fail' })}>Mark fail</button>
          <button class="btn sm" onClick=${() => setMark({ tests: selected, status: 'blocked' })}>Mark blocked</button>
          <button class="btn sm" onClick=${() => setSel(new Set())}>Clear</button></div>` : null}
        ${rows.length ? html`<div class="tablewrap"><table class="t"><thead><tr>
          <th><input type="checkbox" checked=${allSel} onChange=${() => setSel(allSel ? new Set() : new Set(rows.map((t) => t.id)))} aria-label="Select all" /></th>
          <th>ID</th><th>Test</th><th>Priority</th><th>Tags</th><th>Type</th><th>Last result</th><th>History</th><th>Bugs</th></tr></thead><tbody>
          ${rows.slice(0, limit).map((t) => html`<tr class=${sel.has(t.id) ? 'sel' : ''}>
            <td><input type="checkbox" checked=${sel.has(t.id)} onChange=${() => toggle(t.id)} aria-label=${`Select ${t.id}`} /></td>
            <td class="nowrap"><a href=${`#/p/${slug}/tests/${t.id}`}><strong>${t.id}</strong></a></td>
            <td><a href=${`#/p/${slug}/tests/${t.id}`} style="color:inherit">${t.title}</a><div class="muted small">${t.feature}</div></td>
            <td><${Prio} p=${t.priority} /></td>
            <td><${Tags} tags=${t.tags} /></td>
            <td><${Kind} automated=${t.automated} /></td>
            <td class="nowrap"><${Badge} status=${t.lastStatus} />${t.last ? html`<div class="muted small">${ago(t.last.at)}</div>` : null}
              <div class="seg quick" style="margin-top:4px"><button type="button" title=${`Mark ${t.id} pass`} onClick=${() => setMark({ tests: [t], status: 'pass' })}>Pass</button><button type="button" title=${`Mark ${t.id} fail`} onClick=${() => setMark({ tests: [t], status: 'fail' })}>Fail</button></div></td>
            <td><${Dots} slug=${slug} history=${t.history} /></td>
            <td>${t.bugs.length ? t.bugs.map((b) => html`<a href=${`#/p/${slug}/bugs/${b}`}>${b}</a> `) : html`<span class="muted">-</span>`}</td>
          </tr>`)}
        </tbody></table></div>
        ${rows.length > limit ? html`<div class="row" style="margin-top:10px"><span class="muted small">Showing ${limit} of ${rows.length}</span>
          <button class="btn sm" onClick=${() => setLimit(limit + PAGE)}>Show ${Math.min(PAGE, rows.length - limit)} more</button>
          <button class="btn sm ghost" onClick=${() => setLimit(rows.length)}>Show all</button></div>` : null}` : html`<${Empty} title=${tests.length ? 'No test cases match the filters' : 'No test cases yet'}>
          <p>${tests.length ? 'Clear a filter to see more.' : 'Write one here, or add a Markdown file under projects/' + slug + '/cases/<feature>/. New cases appear here instantly.'}</p>
          <a class="btn primary" href=${`#/p/${slug}/tests/new`}>New test case</a></${Empty}>`}
      </div>
    </div>
    ${dialog ? html`<${RunDialog} project=${p} tests=${dialog.tests} onClose=${() => setDialog(null)} sandboxed=${sandboxed} />` : null}
    ${mark ? html`<${QuickResultDialog} project=${p} tests=${mark.tests} initial=${mark.status} onClose=${() => setMark(null)} onDone=${() => setSel(new Set())} />` : null}
  </${Page}>`;
}

export function TestDetail({ slug, id, sandboxed }) {
  const { data: t, error } = useResource(`/api/projects/${slug}/tests/${id}`, { project: slug });
  const { data: p } = useResource(`/api/projects/${slug}`, { project: slug });
  const [dialog, setDialog] = useState(null);
  const [mark, setMark] = useState(null);
  if (error) return html`<${ErrorBox} error=${error} />`;
  if (!t || !p) return html`<${Loading} />`;
  const archive = async () => {
    if (!confirm(`Archive ${t.id}? The file moves to projects/${slug}/archive and its ID is never reused.`)) return;
    try { await del(`/api/projects/${slug}/tests/${t.id}`); toast(`${t.id} archived`, 'good'); location.hash = `#/p/${slug}/tests`; } catch (e) { toast(e.message, 'error'); }
  };
  const sec = (title, body) => (body ? html`<h3>${title}</h3>${body}` : null);
  return html`<${Page} crumbs=${[{ label: p.name, href: `#/p/${slug}` }, { label: 'Test cases', href: `#/p/${slug}/tests` }]} title=${html`<span class="muted">${t.id}</span> ${t.title}`}
    sub=${html`<${Prio} p=${t.priority} /> <${Kind} automated=${t.automated} /> <${Badge} status=${t.lastStatus} /> <${Tags} tags=${t.tags} />`}
    actions=${html`<button class="btn blue" onClick=${() => setDialog({ tests: [t] })}>Run...</button>
      <a class="btn" href=${`#/p/${slug}/tests/${t.id}/edit`}>Edit</a>
      <a class="btn" href=${`#/p/${slug}/bugs/new?test=${t.id}`}>Report bug</a>
      <button class="btn danger" onClick=${archive}>Archive</button>`}>
    <div class="cols">
      <div class="card pad">
        ${sec('Goal', t.goal ? html`<p><${Inline} text=${t.goal} /></p>` : null)}
        ${sec('Preconditions', t.preconditions.length ? html`<ul class="bullets">${t.preconditions.map((x) => html`<li><${Inline} text=${x} /></li>`)}</ul>` : null)}
        ${sec('Data', t.data.length ? html`<ul class="bullets">${t.data.map((x) => html`<li><${Inline} text=${x} /></li>`)}</ul>` : null)}
        <h3>Steps</h3><${StepTree} items=${t.stepTree} slug=${slug} />
        <h3>Expected</h3><ul class="bullets">${t.expected.map((x) => html`<li><${Inline} text=${x} /></li>`)}</ul>
        ${sec('Notes', t.notes ? html`<p><${Inline} text=${t.notes} /></p>` : null)}
        ${t.extraSections.map((e) => html`<h3>${e.heading}</h3><pre style="background:#f6f8fa;color:inherit">${e.text}</pre>`)}
        ${t.specCode ? html`<h3>Playwright test</h3><div class="muted small" style="margin-bottom:6px"><code>${t.specCode.file}</code> line ${t.specCode.line}. Selectors and actions live in the page objects under <code>${p.pagesDir}</code>.</div><pre>${t.specCode.code}</pre>` : html`<h3>Automation</h3><p class="muted small">Not automated yet. Add a Playwright test titled <code>${t.id}: ...</code> in <code>${p.specDir}</code> that uses the page objects in <code>${p.pagesDir}</code>; it links here automatically.</p>`}
      </div>
      <div>
        <div class="card pad section"><div class="row"><strong>Record result</strong>
          <span class="right row" style="gap:6px">
            <button class="btn sm primary" onClick=${() => setMark('pass')}>Pass</button>
            <button class="btn sm danger" onClick=${() => setMark('fail')}>Fail</button>
            <button class="btn sm" onClick=${() => setMark('blocked')}>Blocked</button>
          </span></div>
          <div class="muted small" style="margin-top:6px">Marks this case without stepping through it. Use Run... > Manual to check each step.</div></div>
        <div class="card pad section small"><div class="kv">
          <span class="k">Feature</span><a href=${`#/p/${slug}/tests?feature=${encodeURIComponent(t.feature)}`}>${t.feature}</a>
          <span class="k">Environments</span><span>${t.envs.join(', ')}</span>
          <span class="k">Spec</span>${t.spec ? html`<code>${t.spec}</code>` : html`<span class="muted">manual only</span>`}
          <span class="k">Plans</span><span>${t.plans.length ? t.plans.map((pl) => html`<a href=${`#/p/${slug}/plans/${pl.id}`}>${pl.id}</a> `) : '-'}</span>
          <span class="k">Bugs</span><span>${t.bugs.length ? t.bugs.map((b) => html`<a href=${`#/p/${slug}/bugs/${b}`}>${b}</a> `) : '-'}</span>
          <span class="k">File</span><code>${t.file}</code>
          <span class="k">Updated</span><span>${t.updated || '-'} <span class="muted">(created ${t.created || '-'})</span></span>
        </div></div>
        <div class="card section"><div class="head"><h2>Latest checks</h2>${t.last ? html`<a class="right small" href=${`#/p/${slug}/runs/${t.last.runId}?test=${t.id}`}>${ago(t.last.at)}</a>` : null}</div><div class="body"><${Checks} checks=${t.latestChecks} /></div></div>
        <div class="card section"><div class="head"><h2>History</h2></div>
          ${t.history.length ? html`<table class="t"><tbody>${t.history.map((h) => html`<tr>
            <td><${Badge} status=${h.status} /></td><td><a href=${`#/p/${slug}/runs/${h.runId}?test=${t.id}`} class="small">${fmtDate(h.at)}</a><div class="muted small">${RUNNER_LABEL[h.runner] || h.runner}</div></td>
            <td class="small">${h.checks.pass}/${h.checks.total}</td><td class="small">${dur(h.durationMs)}</td></tr>`)}</tbody></table>` : html`<div class="body muted small">Not run yet.</div>`}
        </div>
      </div>
    </div>
    ${dialog ? html`<${RunDialog} project=${p} tests=${dialog.tests} onClose=${() => setDialog(null)} sandboxed=${sandboxed} />` : null}
    ${mark ? html`<${QuickResultDialog} project=${p} tests=${[t]} initial=${mark} onClose=${() => setMark(null)} />` : null}
  </${Page}>`;
}

const EMPTY = { title: '', feature: '', priority: 'P1', tags: ['regression'], envs: [], requires: [], goal: '', preconditions: [''], data: [''], steps: [''], expected: [''], notes: '' };

export function TestEditor({ slug, id, query }) {
  const isNew = !id;
  const existing = useResource(isNew ? null : `/api/projects/${slug}/tests/${id}`);
  const { data: p } = useResource(`/api/projects/${slug}`, { project: slug });
  const [f, setF] = useState(isNew ? { ...EMPTY, feature: query.feature || '' } : null);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!isNew && existing.data && !f) {
      const t = existing.data;
      setF({ title: t.title, feature: t.feature, priority: t.priority, tags: t.tags, envs: t.envs.filter((e) => e !== 'all'), goal: t.goal,
        preconditions: t.preconditions, data: t.data, steps: t.steps, expected: t.expected, notes: t.notes, extraSections: t.extraSections });
    }
  }, [existing.data]);
  if (!p || !f) return html`<${Loading} />`;
  const set = (k) => (v) => setF((x) => ({ ...x, [k]: v }));
  const save = async () => {
    setBusy(true);
    setErr(null);
    const body = { ...f, envs: f.envs.length ? f.envs : ['all'] };
    try {
      const r = isNew ? await post(`/api/projects/${slug}/tests`, body) : await put(`/api/projects/${slug}/tests/${id}`, body);
      toast(`${r.id} saved`, 'good');
      location.hash = `#/p/${slug}/tests/${r.id}`;
    } catch (e) { setErr(e.message); window.scrollTo(0, 0); } finally { setBusy(false); }
  };
  const features = Object.keys(p.features);
  const tagSuggestions = [...new Set(['smoke', 'regression', 'writes', ...Object.keys(p.tags)])];
  return html`<${Page} crumbs=${[{ label: p.name, href: `#/p/${slug}` }, { label: 'Test cases', href: `#/p/${slug}/tests` }]}
    title=${isNew ? 'New test case' : `Edit ${id}`} sub=${isNew ? `Gets the next free ID (${p.prefix}-...) and is saved as Markdown in projects/${slug}/cases/<feature>/` : null}
    actions=${html`<a class="btn" href=${isNew ? `#/p/${slug}/tests` : `#/p/${slug}/tests/${id}`}>Cancel</a><button class="btn primary" disabled=${busy} onClick=${save}>${busy ? 'Saving...' : 'Save test case'}</button>`}>
    <${ErrorBox} error=${err} />
    <div class="cols">
      <div class="card pad">
        <${Field} label="Title" hint="Describe the behavior, for example: Guest can add an item to the cart"><input value=${f.title} onInput=${(e) => set('title')(e.target.value)} /></${Field}>
        <${Field} label="Goal (optional)"><input value=${f.goal} onInput=${(e) => set('goal')(e.target.value)} placeholder="The user-visible behavior this test proves" /></${Field}>
        <${Field} label="Preconditions"><${ListEditor} items=${f.preconditions} onChange=${set('preconditions')} placeholder="Logged in as standard-user; cart is empty" /></${Field}>
        <${Field} label="Test data"><${ListEditor} items=${f.data} onChange=${set('data')} placeholder="Email: qa+{{uid}}@example.com" /></${Field}>
        <${Field} label="Steps" hint="Write steps the way a user does them. In automation each step maps to page object actions (tests/pages)."><${ListEditor} numbered items=${f.steps} onChange=${set('steps')} placeholder="Click Add to cart on the first product" /></${Field}>
        <${Field} label="Expected results" hint="Each line is one observable check: exact text, count, URL, or state"><${ListEditor} items=${f.expected} onChange=${set('expected')} placeholder="Cart badge shows 1" /></${Field}>
        <${Field} label="Notes (optional)"><textarea value=${f.notes} onInput=${(e) => set('notes')(e.target.value)}></textarea></${Field}>
      </div>
      <div class="card pad">
        <${Field} label="Feature" hint="Folder under cases/ (match the tests/e2e/<feature> folder of this project)"><input list="features" value=${f.feature} onInput=${(e) => set('feature')(e.target.value)} placeholder="checkout" /><datalist id="features">${features.map((x) => html`<option value=${x} />`)}</datalist></${Field}>
        <${Field} label="Priority"><select value=${f.priority} onChange=${(e) => set('priority')(e.target.value)}>
          <option value="P0">P0: release blocker</option><option value="P1">P1: major feature</option><option value="P2">P2: secondary, validation</option><option value="P3">P3: cosmetic</option></select></${Field}>
        <${Field} label="Tags" hint="Suites are tag filters. Use the same tags in the Playwright title (@smoke). Add writes if the test changes data."><${TagPicker} value=${f.tags} onChange=${set('tags')} suggestions=${tagSuggestions} /></${Field}>
        <${Field} label="Environments (optional)" hint="Empty means all"><${TagPicker} value=${f.envs} onChange=${set('envs')} suggestions=${p.envs.map((e) => e.name)} placeholder="staging" /></${Field}>
        <div class="info small">Tip: write steps the way a person would do them. Locators and waits belong in the page objects (<code>tests/pages</code>), not in the test case.</div>
      </div>
    </div>
  </${Page}>`;
}
