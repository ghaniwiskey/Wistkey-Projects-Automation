// API client, live updates (Server-Sent Events), and a tiny event bus for toasts.
import { useState, useEffect, useCallback, useRef } from '../vendor/preact-htm.mjs';

const listeners = new Set();
export function onEvent(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
function emit(type, data) {
  for (const fn of [...listeners]) {
    try { fn(type, data); } catch (e) { console.error(e); }
  }
}

export function connect() {
  const es = new EventSource('/api/events');
  es.addEventListener('hello', (e) => emit('status', { connected: true, ...JSON.parse(e.data) }));
  es.addEventListener('change', (e) => emit('change', JSON.parse(e.data)));
  es.addEventListener('job', (e) => emit('job', JSON.parse(e.data)));
  es.onerror = () => emit('status', { connected: false });
  return es;
}

export async function api(method, url, body) {
  const res = await fetch(url, {
    method,
    headers: { 'content-type': 'application/json', 'x-qa-app': '1' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `${res.status} ${res.statusText}`);
  return data;
}
export const get = (u) => api('GET', u);
export const post = (u, b) => api('POST', u, b || {});
export const put = (u, b) => api('PUT', u, b || {});
export const del = (u) => api('DELETE', u);

export function toast(msg, kind = 'info') {
  emit('toast', { msg, kind, id: Math.random().toString(36).slice(2) });
}

// Fetch a URL and re-fetch quietly when matching files change on disk (editor, Playwright reporter, or another tab).
export function useResource(url, opts = {}) {
  const { project, kinds, jobs } = opts;
  const [state, setState] = useState({ data: null, error: null, loading: true });
  const current = useRef(url);
  const load = useCallback(async (quiet) => {
    if (!url) return;
    if (!quiet) setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await get(url);
      if (current.current === url) setState({ data, error: null, loading: false });
    } catch (e) {
      if (current.current === url) setState((s) => ({ data: quiet ? s.data : null, error: e.message, loading: false }));
    }
  }, [url]);
  useEffect(() => {
    current.current = url;
    load(false);
  }, [url]);
  const kindKey = (kinds || []).join(',');
  useEffect(() => onEvent((type, ev) => {
    if (type === 'change') {
      const projects = ev.projects || [];
      const projOk = projects.length && (!project || projects.includes(project));
      const kindOk = !kinds || (ev.kinds || []).some((k) => kinds.includes(k) || k === 'config');
      if (projOk && kindOk) load(true);
    } else if (type === 'job' && jobs) load(true);
  }), [load, project, kindKey, jobs]);
  return { ...state, reload: () => load(true) };
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}
