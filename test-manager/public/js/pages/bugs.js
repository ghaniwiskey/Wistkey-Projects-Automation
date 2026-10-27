import { sortIssues, formatIssueDate } from '../issue-sort.js';
import { html, useState, useEffect } from '../../vendor/preact-htm.mjs';
import { useResource, get, post, put, toast } from '../api.js';
import { Page, Sev, Empty, Loading, ErrorBox, Field, Html, ListEditor, TagPicker } from '../ui.js';

const STATUS_ACTIONS = [['fixed', 'Mark fixed'], ['verified', 'Verified'], ['open', 'Reopen'], ['wont-fix', "Won't fix"], ['duplicate', 'Duplicate']];

export function BugList({ slug }) {
  const { data: bugs, error } = useResource(`/api/projects/${slug}/bugs`, { project: slug, kinds: ['bugs'] });
  const { data: p } = useResource(`/api/projects/${slug}`, { project: slug });
  const [status, setStatus] = useState('active');
  const [sort, setSort] = useState('recent');
  if (error) return html`<${ErrorBox} error=${error} />`;
  if (!bugs || !p) return html`<${Loading} />`;
  const rows = sortIssues(bugs.filter((b) => status === 'all' || (status === 'active' ? ['open', 'fixed'].includes(b.status) : b.status === status)), sort);
  return html`<${Page} crumbs=${[{ label: p.name, href: `#/p/${slug}` }]} title="Bugs" sub=${`Stored as Markdown in projects/${slug}/bugs/`}
    actions=${html`<a class="btn primary" href=${`#/p/${slug}/bugs/new`}>New bug</a>`}>
    <div class="toolbar"><select aria-label="Filter by status" value=${status} onChange=${(e) => setStatus(e.target.value)}>
      <option value="active">Open or fixed (needs verification)</option><option value="all">All</option>${['open', 'fixed', 'verified', 'wont-fix', 'duplicate'].map((s) => html`<option value=${s}>${s}</option>`)}</select>
      <select aria-label="Sort by" value=${sort} onChange=${(e) => setSort(e.target.value)}>
        <option value="recent">Most recent</option><option value="oldest">Oldest first</option><option value="default">Severity / ID</option>
      </select>
      <span class="muted small right">${rows.length} bugs</span></div>
    ${rows.length ? html`<div class="tablewrap"><table class="t"><thead><tr><th>ID</th><th>Severity</th><th>Status</th><th>Title</th><th>Tests</th><th>Found</th><th title="Times use your browser’s local timezone">Updated (local)</th></tr></thead><tbody>
      ${rows.map((b) => html`<tr><td><a href=${`#/p/${slug}/bugs/${b.id}`}><strong>${b.id}</strong></a></td><td><${Sev} s=${b.severity} /></td><td><span class="tag">${b.status}</span></td>
        <td><a href=${`#/p/${slug}/bugs/${b.id}`} style="color:inherit">${b.title}</a></td><td>${b.tests.map((t) => html`<a href=${`#/p/${slug}/tests/${t}`}>${t}</a> `)}</td><td class="nowrap">${formatIssueDate(b.found)}</td><td class="nowrap">${formatIssueDate(b.updated || b.found)}</td></tr>`)}
    </tbody></table></div>` : html`<${Empty} title="No bugs here">Failed tests can be turned into bug reports from the run page.</${Empty}>`}
  </${Page}>`;
}

export function BugDetail({ slug, bugId }) {
  const { data: b, error } = useResource(`/api/projects/${slug}/bugs/${bugId}`, { project: slug, kinds: ['bugs'] });
  const [note, setNote] = useState('');
  if (error) return html`<${ErrorBox} error=${error} />`;
  if (!b) return html`<${Loading} />`;
  const update = async (patch) => {
    try { await put(`/api/projects/${slug}/bugs/${bugId}`, { ...patch, note }); setNote(''); toast(`${bugId} updated`, 'good'); } catch (e) { toast(e.message, 'error'); }
  };
  return html`<${Page} crumbs=${[{ label: slug, href: `#/p/${slug}` }, { label: 'Bugs', href: `#/p/${slug}/bugs` }]} title=${html`<span class="muted">${b.id}</span> ${b.title}`}
    sub=${html`<${Sev} s=${b.severity} /> <span class="tag">${b.status}</span> found ${formatIssueDate(b.found)}${b.foundBy ? ` (${b.foundBy})` : ''}`}>
    <div class="cols">
      <div class="card pad md"><${Html} html=${b.html} /></div>
      <div>
        <div class="card section"><div class="head"><h2>Update</h2></div><div class="body">
          <${Field} label="Note (added to the bug history)"><textarea rows="2" value=${note} onInput=${(e) => setNote(e.target.value)} placeholder="Fixed in build 1.4.2"></textarea></${Field}>
          <div class="row">${STATUS_ACTIONS.filter(([s]) => s !== b.status).map(([s, label]) => html`<button class=${`btn sm ${s === 'fixed' || s === 'verified' ? 'primary' : ''}`} onClick=${() => update({ status: s })}>${label}</button>`)}</div>
          <div class="row" style="margin-top:10px"><span class="small muted">Severity</span>${['critical', 'major', 'minor', 'trivial'].map((s) => html`<button class=${`btn sm ${b.severity === s ? 'on' : ''}`} onClick=${() => update({ severity: s })}>${s}</button>`)}</div>
          ${note ? html`<button class="btn sm" style="margin-top:10px" onClick=${() => update({})}>Add note only</button>` : null}
        </div></div>
        <div class="card pad small"><div class="kv">
          <span class="k">Environment</span><span>${b.env || '-'}</span>
          <span class="k">URL</span><span>${b.url ? html`<a href=${b.url} target="_blank" rel="noopener">${b.url}</a>` : '-'}</span>
          <span class="k">Tests</span><span>${b.tests.length ? b.tests.map((t) => html`<a href=${`#/p/${slug}/tests/${t}`}>${t}</a> `) : '-'}</span>
          <span class="k">Frequency</span><span>${b.frequency || '-'}</span>
          <span class="k">File</span><code>${b.file}</code></div>
          <p class="muted">When a fix lands, rerun the linked tests, then mark the bug verified.</p></div>
      </div>
    </div>
  </${Page}>`;
}

export function BugEditor({ slug, query }) {
  const { data: p } = useResource(`/api/projects/${slug}`, { project: slug });
  const [f, setF] = useState(null);
  const [err, setErr] = useState(null);
  useEffect(() => {
    if (!p || f) return;
    const base = { title: '', severity: 'major', env: p.defaultEnv, url: (p.envs.find((e) => e.isDefault) || {}).baseUrl || '', tests: [], summary: '', steps: [''], expected: '', actual: '', evidence: [], foundBy: '' };
    (async () => {
      if (query.test) {
        try {
          const t = await get(`/api/projects/${slug}/tests/${query.test}`);
          base.tests = [t.id];
          base.title = `${t.title}: `;
          base.steps = [...t.preconditions.map((x) => `Precondition: ${x}`), ...t.steps];
          base.expected = t.expected.join('\n');
        } catch { /* test may be gone */ }
      }
      if (query.run) {
        base.foundBy = `runs/${query.run}`;
        try {
          const r = await get(`/api/projects/${slug}/runs/${query.run}`);
          const rt = r.tests.find((x) => x.id === query.test);
          base.env = r.env;
          if (rt) {
            base.actual = [...(rt.checks || []).filter((c) => !c.pass).map((c) => `Failed: ${c.label}${c.actual ? ` (actual: ${c.actual})` : ''}`), ...(rt.notes || []), rt.error || ''].filter(Boolean).join('\n');
            base.evidence = (rt.evidence || []).map((e) => `../runs/${query.run}/${e.path}`);
            if (rt.url) base.url = rt.url;
          }
        } catch { /* run may be gone */ }
      }
      setF(base);
    })();
  }, [p]);
  if (!p || !f) return html`<${Loading} />`;
  const set = (k, v) => setF({ ...f, [k]: v });
  const save = async () => {
    setErr(null);
    try {
      const r = await post(`/api/projects/${slug}/bugs`, { ...f, evidence: f.evidence.map((e) => (/\.(png|jpe?g|webp|gif)$/i.test(e) ? `Screenshot: ![evidence](${e})` : e)) });
      toast(`${r.id} filed`, 'good');
      location.hash = `#/p/${slug}/bugs/${r.id}`;
    } catch (e) { setErr(e.message); window.scrollTo(0, 0); }
  };
  return html`<${Page} crumbs=${[{ label: p.name, href: `#/p/${slug}` }, { label: 'Bugs', href: `#/p/${slug}/bugs` }]} title="New bug"
    actions=${html`<a class="btn" href=${`#/p/${slug}/bugs`}>Cancel</a><button class="btn primary" onClick=${save}>File bug</button>`}>
    <${ErrorBox} error=${err} />
    <div class="cols">
      <div class="card pad">
        <${Field} label="Title" hint="What is wrong, where. Specific and searchable."><input value=${f.title} onInput=${(e) => set('title', e.target.value)} /></${Field}>
        <${Field} label="Summary"><textarea rows="2" value=${f.summary} onInput=${(e) => set('summary', e.target.value)}></textarea></${Field}>
        <${Field} label="Steps to reproduce"><${ListEditor} numbered items=${f.steps} onChange=${(v) => set('steps', v)} /></${Field}>
        <${Field} label="Expected"><textarea rows="3" value=${f.expected} onInput=${(e) => set('expected', e.target.value)}></textarea></${Field}>
        <${Field} label="Actual"><textarea rows="3" value=${f.actual} onInput=${(e) => set('actual', e.target.value)}></textarea></${Field}>
        <${Field} label="Evidence" hint="Screenshot paths are embedded as images in the bug file"><${ListEditor} items=${f.evidence.length ? f.evidence : ['']} onChange=${(v) => set('evidence', v)} /></${Field}>
      </div>
      <div class="card pad">
        <${Field} label="Severity"><select value=${f.severity} onChange=${(e) => set('severity', e.target.value)}>
          <option value="critical">Critical: crash, data loss, security, blocked flow</option><option value="major">Major: feature broken, workaround exists</option>
          <option value="minor">Minor: edge case, poor messaging</option><option value="trivial">Trivial: cosmetic</option></select></${Field}>
        <${Field} label="Environment"><select value=${f.env} onChange=${(e) => set('env', e.target.value)}>${p.envs.map((e) => html`<option value=${e.name}>${e.name}</option>`)}</select></${Field}>
        <${Field} label="URL"><input value=${f.url} onInput=${(e) => set('url', e.target.value)} /></${Field}>
        <${Field} label="Linked tests"><${TagPicker} value=${f.tests} onChange=${(v) => set('tests', v.map((x) => x.toUpperCase()))} placeholder="TODO-001" /></${Field}>
        <${Field} label="Found by" hint="Run folder or exploration"><input value=${f.foundBy} onInput=${(e) => set('foundBy', e.target.value)} /></${Field}>
      </div>
    </div>
  </${Page}>`;
}
