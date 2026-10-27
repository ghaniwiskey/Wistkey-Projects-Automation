// Open questions for the product owner: unclear intended behavior found while testing (projects/<slug>/questions/).
import { html, useState, useEffect } from '../../vendor/preact-htm.mjs';
import { useResource, post, put, toast } from '../api.js';
import { Page, Empty, Loading, ErrorBox, Field, Html, ListEditor, TagPicker } from '../ui.js';

const STATUSES = ['open', 'answered', 'closed'];
const links = (slug, kind, ids) => ids.map((x) => html`<a href=${`#/p/${slug}/${kind}/${x}`}>${x}</a> `);

export function QuestionList({ slug }) {
  const { data: qs, error } = useResource(`/api/projects/${slug}/questions`, { project: slug, kinds: ['questions'] });
  const { data: p } = useResource(`/api/projects/${slug}`, { project: slug });
  const [status, setStatus] = useState('open');
  if (error) return html`<${ErrorBox} error=${error} />`;
  if (!qs || !p) return html`<${Loading} />`;
  const rows = qs.filter((x) => status === 'all' || x.status === status);
  return html`<${Page} crumbs=${[{ label: p.name, href: `#/p/${slug}` }]} title="Questions" sub=${`Unclear intended behavior to confirm with the product owner. Stored as Markdown in projects/${slug}/questions/`}
    actions=${html`<a class="btn primary" href=${`#/p/${slug}/questions/new`}>New question</a>`}>
    <div class="toolbar"><select value=${status} onChange=${(e) => setStatus(e.target.value)}>
      ${STATUSES.map((s) => html`<option value=${s}>${s}</option>`)}<option value="all">All</option></select>
      <span class="muted small right">${rows.length} questions</span></div>
    ${rows.length ? html`<div class="tablewrap"><table class="t"><thead><tr><th>ID</th><th>Status</th><th>Question</th><th>Tests</th><th>Bugs</th><th>Asked</th><th>Answered</th></tr></thead><tbody>
      ${rows.map((x) => html`<tr><td><a href=${`#/p/${slug}/questions/${x.id}`}><strong>${x.id}</strong></a></td><td><span class="tag">${x.status}</span></td>
        <td><a href=${`#/p/${slug}/questions/${x.id}`} style="color:inherit">${x.title}</a></td><td>${links(slug, 'tests', x.tests)}</td><td>${links(slug, 'bugs', x.bugs)}</td>
        <td class="nowrap">${x.found}</td><td class="nowrap">${x.answered || '-'}</td></tr>`)}
    </tbody></table></div>` : html`<${Empty} title="No questions here">Record unclear behavior found while testing, then add the product owner's answer.</${Empty}>`}
  </${Page}>`;
}

export function QuestionDetail({ slug, qid }) {
  const { data: x, error } = useResource(`/api/projects/${slug}/questions/${qid}`, { project: slug, kinds: ['questions'] });
  const [answer, setAnswer] = useState(null);
  const [note, setNote] = useState('');
  if (error) return html`<${ErrorBox} error=${error} />`;
  if (!x) return html`<${Loading} />`;
  const ans = answer === null ? x.answer : answer;
  const update = async (patch) => {
    try { await put(`/api/projects/${slug}/questions/${qid}`, { ...patch, note }); setNote(''); setAnswer(null); toast(`${qid} updated`, 'good'); } catch (e) { toast(e.message, 'error'); }
  };
  return html`<${Page} crumbs=${[{ label: slug, href: `#/p/${slug}` }, { label: 'Questions', href: `#/p/${slug}/questions` }]} title=${html`<span class="muted">${x.id}</span> ${x.title}`}
    sub=${html`<span class="tag">${x.status}</span> asked ${x.found}${x.askedTo ? ` to ${x.askedTo}` : ''}${x.answered ? `, answered ${x.answered}` : ''}`}>
    <div class="cols">
      <div class="card pad md"><${Html} html=${x.html} /></div>
      <div>
        <div class="card section"><div class="head"><h2>Answer</h2></div><div class="body">
          <${Field} label="Answer from the product owner" hint="Saving marks the question answered"><textarea rows="4" value=${ans} onInput=${(e) => setAnswer(e.target.value)} placeholder="Intended: the reward stays after a refund."></textarea></${Field}>
          <${Field} label="Note (added to the history)"><textarea rows="2" value=${note} onInput=${(e) => setNote(e.target.value)} placeholder="Asked in the 27 Oct sync"></textarea></${Field}>
          <div class="row">
            <button class="btn sm primary" disabled=${!String(ans || '').trim() || ans === x.answer} onClick=${() => update({ answer: ans })}>Save answer</button>
            ${STATUSES.filter((s) => s !== x.status).map((s) => html`<button class="btn sm" onClick=${() => update({ status: s })}>${s === 'open' ? 'Reopen' : s === 'closed' ? 'Close' : 'Mark answered'}</button>`)}
            ${note ? html`<button class="btn sm" onClick=${() => update({})}>Add note only</button>` : null}
          </div>
          <p class="muted small">When answered: a bug -> file it and link it here; intended behavior -> update the linked cases.</p>
        </div></div>
        <div class="card pad small"><div class="kv">
          <span class="k">Environment</span><span>${x.env || '-'}</span>
          <span class="k">Tests</span><span>${x.tests.length ? links(slug, 'tests', x.tests) : '-'}</span>
          <span class="k">Bugs</span><span>${x.bugs.length ? links(slug, 'bugs', x.bugs) : '-'}</span>
          <span class="k">File</span><code>${x.file}</code></div></div>
      </div>
    </div>
  </${Page}>`;
}

export function QuestionEditor({ slug }) {
  const { data: p } = useResource(`/api/projects/${slug}`, { project: slug });
  const [f, setF] = useState(null);
  const [err, setErr] = useState(null);
  useEffect(() => { if (p && !f) setF({ title: '', question: '', context: '', askedTo: '', env: p.defaultEnv, tests: [], bugs: [], evidence: [], foundBy: '' }); }, [p]);
  if (!p || !f) return html`<${Loading} />`;
  const set = (k, v) => setF({ ...f, [k]: v });
  const save = async () => {
    setErr(null);
    try {
      const r = await post(`/api/projects/${slug}/questions`, { ...f, evidence: f.evidence.filter(Boolean).map((e) => (/\.(png|jpe?g|webp|gif)$/i.test(e) ? `Screenshot: ![evidence](${e})` : e)) });
      toast(`${r.id} added`, 'good');
      location.hash = `#/p/${slug}/questions/${r.id}`;
    } catch (e) { setErr(e.message); window.scrollTo(0, 0); }
  };
  return html`<${Page} crumbs=${[{ label: p.name, href: `#/p/${slug}` }, { label: 'Questions', href: `#/p/${slug}/questions` }]} title="New question"
    actions=${html`<a class="btn" href=${`#/p/${slug}/questions`}>Cancel</a><button class="btn primary" onClick=${save}>Add question</button>`}>
    <${ErrorBox} error=${err} />
    <div class="cols">
      <div class="card pad">
        <${Field} label="Title" hint="Short, searchable"><input value=${f.title} onInput=${(e) => set('title', e.target.value)} /></${Field}>
        <${Field} label="Question"><textarea rows="3" value=${f.question} onInput=${(e) => set('question', e.target.value)} placeholder="Is it intended that ...?"></textarea></${Field}>
        <${Field} label="Context" hint="What you saw, where, with which data"><textarea rows="5" value=${f.context} onInput=${(e) => set('context', e.target.value)}></textarea></${Field}>
        <${Field} label="Evidence" hint="Screenshot paths are embedded as images"><${ListEditor} items=${f.evidence.length ? f.evidence : ['']} onChange=${(v) => set('evidence', v)} /></${Field}>
      </div>
      <div class="card pad">
        <${Field} label="Asked to"><input value=${f.askedTo} onInput=${(e) => set('askedTo', e.target.value)} placeholder="Product owner" /></${Field}>
        <${Field} label="Environment"><select value=${f.env} onChange=${(e) => set('env', e.target.value)}>${p.envs.map((e) => html`<option value=${e.name}>${e.name}</option>`)}</select></${Field}>
        <${Field} label="Linked tests"><${TagPicker} value=${f.tests} onChange=${(v) => set('tests', v.map((x) => x.toUpperCase()))} placeholder="TODO-001" /></${Field}>
        <${Field} label="Linked bugs"><${TagPicker} value=${f.bugs} onChange=${(v) => set('bugs', v.map((x) => x.toUpperCase()))} placeholder="BUG-001" /></${Field}>
        <${Field} label="Found by" hint="Run folder or exploration"><input value=${f.foundBy} onInput=${(e) => set('foundBy', e.target.value)} /></${Field}>
      </div>
    </div>
  </${Page}>`;
}
