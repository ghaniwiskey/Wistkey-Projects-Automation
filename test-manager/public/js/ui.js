// Shared UI components and formatting helpers.
import { html, useState, useEffect, useRef } from '../vendor/preact-htm.mjs';
import { onEvent } from './api.js';

export const STATUS_LABEL = {
  pass: 'Pass', fail: 'Fail', flaky: 'Flaky', blocked: 'Blocked', skipped: 'Skipped', never: 'Not run', untested: 'Untested',
  'in-progress': 'In progress', empty: 'Empty', running: 'Running', queued: 'Queued', retrying: 'Retrying', passed: 'Passed',
  failed: 'Failed', cancelled: 'Cancelled', error: 'Error', pending: 'Pending', processing: 'Processing', done: 'Done',
};
export const RUNNER_LABEL = { playwright: 'Playwright', manual: 'Manual' };
export const STATUSES = ['pass', 'flaky', 'fail', 'blocked', 'skipped', 'untested'];

const pad = (n) => String(n).padStart(2, '0');
export function fmtDate(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
export function ago(iso) {
  if (!iso) return '-';
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  if (s < 86400 * 30) return `${Math.floor(s / 86400)} d ago`;
  return fmtDate(iso).slice(0, 10);
}
export function dur(ms) {
  if (ms == null || Number.isNaN(ms)) return '-';
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(1)}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`;
  return `${Math.floor(s / 3600)}h ${Math.round((s % 3600) / 60)}m`;
}
export const pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export function inlineMd(s) {
  return esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/-&gt; Expect:/g, '<strong class="n-pass">Expect:</strong>');
}

export const Html = ({ html: h, cls }) => html`<span class=${cls || ''} dangerouslySetInnerHTML=${{ __html: h }}></span>`;
export const Inline = ({ text }) => html`<${Html} html=${inlineMd(text)} />`;
export const Badge = ({ status, text }) => html`<span class=${`badge s-${status}`}>${text ?? STATUS_LABEL[status] ?? status}</span>`;
export const Prio = ({ p }) => html`<span class=${`prio p-${p}`} title=${{ P0: 'Release blocker', P1: 'Major', P2: 'Secondary', P3: 'Cosmetic' }[p] || ''}>${p || '-'}</span>`;
export const Sev = ({ s }) => html`<span class=${`sev sev-${s}`}>${s}</span>`;
export const Tags = ({ tags }) => html`${(tags || []).map((t) => html`<span class="tag">${t}</span>`)}`;
export const Kind = ({ automated }) => (automated ? html`<span class="tag auto">Automated</span>` : html`<span class="tag">Manual</span>`);

export function verdictText(run) {
  const s = run.summary || {};
  if (run.inProgress) return { cls: 'in-progress', text: `In progress (${s.total - (s.untested || 0)}/${s.total})` };
  if (s.fail) return { cls: 'fail', text: `Fail (${s.fail})` };
  if (s.blocked) return { cls: 'blocked', text: `Blocked (${s.blocked})` };
  if (s.flaky) return { cls: 'flaky', text: 'Pass (flaky)' };
  if (s.pass) return { cls: 'pass', text: 'Pass' };
  if (s.total && s.untested === s.total) return { cls: 'never', text: 'Reset to Not run' };
  return { cls: 'skipped', text: s.total ? 'Skipped' : 'Empty' };
}
export const Verdict = ({ run }) => {
  const v = verdictText(run);
  return html`<${Badge} status=${v.cls} text=${v.text} />`;
};

export function StatusBar({ s }) {
  const total = (s && s.total) || 0;
  if (!total) return html`<div class="bar"></div>`;
  return html`<div class="bar" title=${STATUSES.filter((k) => s[k]).map((k) => `${s[k]} ${k}`).join(', ')}>
    ${STATUSES.filter((k) => s[k]).map((k) => html`<span class=${`c-${k}`} style=${`width:${(100 * s[k]) / total}%`}></span>`)}
  </div>`;
}
export const Counts = ({ s }) => html`<span class="counts">${STATUSES.filter((k) => s && s[k]).map((k) => html`<span class=${`n-${k}`}>${s[k]} ${k}</span>`)}</span>`;

export function Dots({ slug, history }) {
  if (!history || !history.length) return html`<span class="muted">-</span>`;
  return html`<span class="dots">${history.map((h) => html`<a class=${`dot c-${h.status}`} href=${`#/p/${slug}/runs/${h.runId}`} title=${`${h.runId} (${RUNNER_LABEL[h.runner] || h.runner}): ${h.status}`}></a>`)}</span>`;
}

export const Kpi = ({ label, value, sub, tone }) => html`<div class=${`kpi ${tone || ''}`}><div class="l">${label}</div><div class="v">${value}</div>${sub ? html`<div class="s">${sub}</div>` : null}</div>`;

export const Empty = ({ title, children }) => html`<div class="empty"><b>${title}</b>${children}</div>`;
export const Loading = () => html`<p class="muted">Loading...</p>`;
export const ErrorBox = ({ error }) => (error ? html`<div class="err">${error}</div>` : null);

export function Page({ crumbs, title, sub, actions, children }) {
  return html`<div>
    <div class="topbar">
      <div class="titles">
        ${crumbs && crumbs.length ? html`<div class="crumbs">${crumbs.map((c, i) => html`${i ? ' / ' : ''}${c.href ? html`<a href=${c.href}>${c.label}</a>` : c.label}`)}</div>` : null}
        <h1>${title}</h1>
        ${sub ? html`<div class="muted small" style="margin-top:4px">${sub}</div>` : null}
      </div>
      <div class="actions">${actions}</div>
    </div>
    ${children}
  </div>`;
}

export function Modal({ title, onClose, children, footer, wide }) {
  useEffect(() => {
    const k = (e) => { if (e.key === 'Escape') onClose(); };
    addEventListener('keydown', k);
    return () => removeEventListener('keydown', k);
  }, [onClose]);
  return html`<div class="overlay" onMouseDown=${(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <div class=${`modal ${wide ? 'wide' : ''}`} role="dialog" aria-label=${title}>
      <div class="mh"><h2>${title}</h2><button class="btn ghost sm right" onClick=${onClose} aria-label="Close">Close</button></div>
      <div class="mb">${children}</div>
      ${footer ? html`<div class="mf">${footer}</div>` : null}
    </div>
  </div>`;
}

export const Field = ({ label, hint, children }) => html`<label class="field"><span class="lbl">${label}</span>${children}${hint ? html`<span class="hint">${hint}</span>` : null}</label>`;

// Editable list: one textarea per item, reorder/remove, paste several lines to add several items.
export function ListEditor({ items, onChange, placeholder, numbered }) {
  const list = items && items.length ? items : [''];
  const set = (i, v) => {
    const lines = v.split('\n');
    const next = [...list];
    if (lines.length > 1) next.splice(i, 1, ...lines.map((l) => l.replace(/^\s*(?:[-*]|\d+[.)])\s+/, '')).filter((l, j) => l.trim() || j === 0));
    else next[i] = v;
    onChange(next);
  };
  const move = (i, d) => {
    const next = [...list];
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const remove = (i) => onChange(list.filter((_, j) => j !== i));
  return html`<div>
    ${list.map((it, i) => html`<div class="le-row">
      <span class="num">${numbered ? `${i + 1}.` : '-'}</span>
      <textarea rows="1" value=${it} placeholder=${i === 0 ? placeholder : ''} onInput=${(e) => set(i, e.target.value)}
        onKeyDown=${(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); const next = [...list]; next.splice(i + 1, 0, ''); onChange(next); setTimeout(() => { const tas = e.target.closest('div').parentElement.querySelectorAll('textarea'); tas[i + 1] && tas[i + 1].focus(); }, 0); } }}></textarea>
      <span class="ops">
        <button type="button" title="Move up" onClick=${() => move(i, -1)}>Up</button>
        <button type="button" title="Move down" onClick=${() => move(i, 1)}>Dn</button>
        <button type="button" title="Remove" onClick=${() => remove(i)}>X</button>
      </span>
    </div>`)}
    <button type="button" class="btn sm" onClick=${() => onChange([...list, ''])}>Add ${numbered ? 'step' : 'item'}</button>
    <span class="muted small" style="margin-left:8px">Enter adds a new line. Pasting several lines splits them.</span>
  </div>`;
}

export function TagPicker({ value, onChange, suggestions, placeholder }) {
  const [text, setText] = useState('');
  const tags = value || [];
  const add = (t) => {
    const parts = String(t).split(/[,\s]+/).map((x) => x.trim().toLowerCase()).filter(Boolean);
    if (parts.length) onChange([...new Set([...tags, ...parts])]);
    setText('');
  };
  return html`<div>
    <div class="row" style="gap:4px;margin-bottom:6px">${tags.map((t) => html`<span class="tag">${t} <a href="javascript:void 0" onClick=${() => onChange(tags.filter((x) => x !== t))} title="Remove">x</a></span>`)}</div>
    <input value=${text} placeholder=${placeholder || 'Type and press Enter'} onInput=${(e) => setText(e.target.value)}
      onKeyDown=${(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(text); } }} onBlur=${() => text && add(text)} />
    ${suggestions && suggestions.length ? html`<div class="chips">${suggestions.filter((s) => !tags.includes(s)).map((s) => html`<button type="button" class="chip" onClick=${() => add(s)}>+ ${s}</button>`)}</div>` : null}
  </div>`;
}

export function Toasts() {
  const [items, setItems] = useState([]);
  useEffect(() => onEvent((type, t) => {
    if (type !== 'toast') return;
    setItems((x) => [...x, t]);
    setTimeout(() => setItems((x) => x.filter((y) => y.id !== t.id)), t.kind === 'error' ? 7000 : 3500);
  }), []);
  return html`<div class="toasts">${items.map((t) => html`<div class=${`toast ${t.kind}`}>${t.msg}</div>`)}</div>`;
}

export function Lightbox() {
  const [src, setSrc] = useState(null);
  useEffect(() => {
    const click = (e) => {
      const img = e.target.closest && e.target.closest('img.zoom');
      if (img) { e.preventDefault(); setSrc(img.src); }
    };
    const key = (e) => { if (e.key === 'Escape') setSrc(null); };
    document.addEventListener('click', click);
    addEventListener('keydown', key);
    return () => { document.removeEventListener('click', click); removeEventListener('keydown', key); };
  }, []);
  return src ? html`<div class="lightbox" onClick=${() => setSrc(null)}><img src=${src} alt="Screenshot" /></div>` : null;
}

export function Checks({ checks }) {
  if (!checks || !checks.length) return html`<p class="muted small">No checks recorded.</p>`;
  return html`<ul class="checks">${checks.map((c) => html`<li class=${c.pass ? 'ok' : 'ko'}><span class="mark">${c.pass ? 'PASS' : 'FAIL'}</span><${Inline} text=${c.label} />${c.actual ? html`<div class="actual">actual: <code>${c.actual}</code></div>` : null}</li>`)}</ul>`;
}

export function useInterval(fn, ms) {
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => {
    const id = setInterval(() => ref.current(), ms);
    return () => clearInterval(id);
  }, [ms]);
}

// ---------------------------------------------------------------- steps
const argText = (args) => Object.entries(args || {}).filter(([, v]) => v !== null && v !== undefined && v !== '').map(([k, v]) => `${k}=${v}`).join(', ');

// Read-only steps with flows as expandable groups (nested).
export function StepTree({ items, slug, prefix = '', open = false }) {
  if (!items || !items.length) return html`<p class="muted small">No steps.</p>`;
  return html`<ol class="tree">${items.map((it, i) => {
    const num = `${prefix}${i + 1}`;
    if (it.kind !== 'flow') return html`<li data-num=${num}><${Inline} text=${it.text} /></li>`;
    return html`<li data-num=${num} class="flowstep"><details class="flow" open=${open || !!it.error}>
      <summary><span class="tag flow">Flow</span> ${it.title || it.name}
        ${argText(it.args) ? html` <span class="muted small">(${argText(it.args)})</span>` : null}
        <span class="muted small"> ${it.steps.length} step${it.steps.length === 1 ? '' : 's'}</span>
        ${it.error ? html` <span class="n-fail small">${it.error}</span>` : null}
        ${it.missing && it.missing.length ? html` <span class="n-fail small">missing ${it.missing.join(', ')}</span>` : null}</summary>
      ${it.skipIf ? html`<div class="muted small flowmeta">Skip if: ${it.skipIf}</div>` : null}
      <${StepTree} items=${it.steps} slug=${slug} prefix=${`${num}.`} />
      ${it.result && it.result.length ? html`<div class="muted small flowmeta">Result: ${it.result.join('; ')}</div>` : null}
    </details></li>`;
  })}</ol>`;
}

// Steps with recorded results (manual runs), flows as groups.
export function ResultTree({ items, prefix = '' }) {
  return html`<ul class="checks">${(items || []).map((s, i) => {
    const num = `${prefix}${i + 1}`;
    const st = s.status || '-';
    const cls = s.status === 'fail' ? 'ko' : s.status === 'pass' ? 'ok' : '';
    if (s.kind === 'flow') {
      return html`<li class=${cls}><span class="mark">${st === 'skipped' ? 'DONE' : st === 'pass' ? 'DONE' : st.toUpperCase()}</span>${num}. <span class="tag flow">Flow</span> ${s.title || s.name}${s.status === 'skipped' ? html` <span class="muted small">(already in place)</span>` : null}
        <div style="margin-left:24px"><${ResultTree} items=${s.steps} prefix=${`${num}.`} /></div></li>`;
    }
    return html`<li class=${cls}><span class="mark">${s.status === 'pass' ? 'DONE' : st.toUpperCase()}</span>${num}. <${Inline} text=${s.text} /></li>`;
  })}</ul>`;
}
