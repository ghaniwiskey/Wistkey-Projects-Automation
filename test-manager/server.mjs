// Test Manager web app server: REST API + live updates over the QA workspace files.
// Start: npm run tm   (or double-click "Start Test Manager.cmd")   ->   http://127.0.0.1:7358/
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { ROOT, PROJECTS, REPORTS } from './lib/workspace.mjs';
import { buildHtmlReport } from './lib/html-report.mjs';
import { buildMissingRunReports } from './lib/run-report.mjs';
import * as store from './lib/store.mjs';
import * as jobs from './lib/jobs.mjs';

const PUBLIC = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public');
const VERSION = '1.0.0';
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.gif': 'image/gif', '.ico': 'image/x-icon', '.md': 'text/plain; charset=utf-8', '.zip': 'application/zip', '.txt': 'text/plain; charset=utf-8',
};

// ---------------------------------------------------------------- tiny router
const routes = [];
function route(method, pattern, handler) {
  const keys = [];
  const re = new RegExp('^' + pattern.replace(/:(\w+)/g, (m, k) => { keys.push(k); return '([^/]+)'; }) + '$');
  routes.push({ method, re, keys, handler });
}
function match(method, pathname) {
  for (const r of routes) {
    if (r.method !== method) continue;
    const m = r.re.exec(pathname);
    if (m) return { handler: r.handler, params: Object.fromEntries(r.keys.map((k, i) => [k, decodeURIComponent(m[i + 1])])) };
  }
  return null;
}

function send(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' });
  res.end(body);
}
function sendFile(res, file) {
  res.writeHead(200, { 'content-type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-cache', 'x-content-type-options': 'nosniff' });
  fs.createReadStream(file).pipe(res);
}
function readBody(req, limit = 25 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) { reject(Object.assign(new Error('Request too large'), { status: 413 })); req.destroy(); } else chunks.push(c);
    });
    req.on('end', () => {
      if (!chunks.length) return resolve({});
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); } catch { reject(Object.assign(new Error('Invalid JSON body'), { status: 400 })); }
    });
    req.on('error', reject);
  });
}

// ---------------------------------------------------------------- live updates
const clients = new Set();
function broadcast(event, data) {
  const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of clients) res.write(msg);
}
const leanJob = (j) => ({
  id: j.id, kind: j.kind, project: j.project, env: j.env, ids: j.ids, plan: j.plan, headed: j.headed, status: j.status, startedAt: j.startedAt,
  finishedAt: j.finishedAt, total: j.total, tests: j.tests, runIds: j.runIds, error: j.error, exitCode: j.exitCode, sandboxed: j.sandboxed, logTail: j.log.slice(-80),
});

function watchWorkspace() {
  const pending = new Map();
  let timer = null;
  const flush = () => {
    timer = null;
    const projects = new Set();
    const kinds = new Set();
    const finished = new Set();
    let specs = false;
    for (const [rootName, file] of pending.values()) {
      if (rootName === 'specs') { specs = true; continue; }
      const seg = file.split(/[\\/]/);
      if (!seg[0] || seg[0].startsWith('_') || seg[0].startsWith('.')) continue;
      if (seg[1] === 'tests') { store.invalidate(seg[0]); projects.add(seg[0]); kinds.add('specs'); continue; } // POM suite changed
      projects.add(seg[0]);
      kinds.add(seg[1] === 'cases' || seg[1] === 'archive' ? 'tests' : seg[1] && !seg[1].includes('.') ? seg[1] : 'config');
      if (seg[1] === 'runs' && seg[2] && seg[3] === 'results.json') finished.add(`${seg[0]}|${seg[2]}`);
    }
    // A run's results.json changed (Playwright reporter, another tool): rebuild its HTML report if it is finished.
    for (const key of finished) {
      const [slug, runId] = key.split('|');
      setTimeout(() => {
        try {
          const res = JSON.parse(fs.readFileSync(path.join(PROJECTS, slug, 'runs', runId, 'results.json'), 'utf8'));
          if (!res.inProgress) S.runReport(slug, runId, false);
        } catch { /* run folder removed or half-written */ }
      }, 400);
    }
    pending.clear();
    // shared/ changed: every project may use it.
    if (specs) { store.invalidate(); for (const slug of store.listProjects().map((x) => x.slug)) projects.add(slug); kinds.add('specs'); }
    for (const slug of projects) store.invalidate(slug);
    if (projects.size) broadcast('change', { projects: [...projects], kinds: [...kinds] });
  };
  for (const [name, dir] of [['projects', PROJECTS], ['specs', path.join(ROOT, 'shared')]]) {
    fs.mkdirSync(dir, { recursive: true });
    try {
      fs.watch(dir, { recursive: true }, (evt, filename) => {
        if (!filename) return;
        pending.set(`${name}|${filename}`, [name, String(filename)]);
        if (!timer) timer = setTimeout(flush, 300);
      });
    } catch (e) {
      console.warn(`File watching unavailable for ${dir}: ${e.message}. Live updates need a manual refresh.`);
    }
  }
}

// ---------------------------------------------------------------- API
const S = store;
route('GET', '/api/state', () => ({
  version: VERSION, workspace: ROOT, sandboxed: jobs.SANDBOXED, projects: S.listProjects(), recentRuns: S.recentRuns(12),
  jobs: jobs.listJobs().slice(0, 10),
}));
route('GET', '/api/projects', () => S.listProjects());
route('POST', '/api/projects', ({ body }) => S.createProject(body));
route('GET', '/api/projects/:slug', ({ params }) => S.getProject(params.slug));
route('PUT', '/api/projects/:slug/config', ({ params, body }) => S.updateProjectConfig(params.slug, body));
route('GET', '/api/projects/:slug/lint', ({ params }) => S.projectLint(params.slug));

route('GET', '/api/projects/:slug/tests', ({ params }) => S.listTests(params.slug));
route('POST', '/api/projects/:slug/tests', ({ params, body }) => S.createTest(params.slug, body));
route('GET', '/api/projects/:slug/tests/:id', ({ params }) => S.getTest(params.slug, params.id));
route('PUT', '/api/projects/:slug/tests/:id', ({ params, body }) => S.updateTest(params.slug, params.id, body));
route('DELETE', '/api/projects/:slug/tests/:id', ({ params }) => S.archiveTest(params.slug, params.id));

route('GET', '/api/projects/:slug/runs', ({ params }) => S.listRuns(params.slug));
route('GET', '/api/projects/:slug/runs/:runId', ({ params }) => S.getRun(params.slug, params.runId));
route('DELETE', '/api/projects/:slug/runs/:runId', ({ params }) => S.deleteRun(params.slug, params.runId));
route('PUT', '/api/projects/:slug/runs/:runId/tests/:id', ({ params, body }) => S.triageRunTest(params.slug, params.runId, params.id, body));

route('POST', '/api/projects/:slug/manual-runs', ({ params, body }) => S.createManualRun(params.slug, body));
route('PUT', '/api/projects/:slug/manual-runs/:runId/tests/:id', ({ params, body }) => S.updateManualTest(params.slug, params.runId, params.id, body));
route('POST', '/api/projects/:slug/manual-runs/:runId/tests/:id/evidence', ({ params, body }) => S.addManualEvidence(params.slug, params.runId, params.id, body));
route('POST', '/api/projects/:slug/results', ({ params, body }) => S.recordResults(params.slug, body));
route('POST', '/api/projects/:slug/manual-runs/:runId/finish', ({ params, body }) => S.finishManualRun(params.slug, params.runId, body));

route('GET', '/api/projects/:slug/plans', ({ params }) => S.listPlans(params.slug));
route('POST', '/api/projects/:slug/plans', ({ params, body }) => S.createPlan(params.slug, body));
route('GET', '/api/projects/:slug/plans/:planId', ({ params }) => S.getPlan(params.slug, params.planId));
route('PUT', '/api/projects/:slug/plans/:planId', ({ params, body }) => S.updatePlan(params.slug, params.planId, body));

route('GET', '/api/projects/:slug/bugs', ({ params }) => S.listBugs(params.slug));
route('POST', '/api/projects/:slug/bugs', ({ params, body }) => S.createBug(params.slug, body));
route('GET', '/api/projects/:slug/bugs/:bugId', ({ params }) => S.getBug(params.slug, params.bugId));
route('PUT', '/api/projects/:slug/bugs/:bugId', ({ params, body }) => S.updateBug(params.slug, params.bugId, body));
route('GET', '/api/projects/:slug/questions', ({ params }) => S.listQuestions(params.slug));
route('POST', '/api/projects/:slug/questions', ({ params, body }) => S.createQuestion(params.slug, body));
route('GET', '/api/projects/:slug/questions/:qid', ({ params }) => S.getQuestion(params.slug, params.qid));
route('PUT', '/api/projects/:slug/questions/:qid', ({ params, body }) => S.updateQuestion(params.slug, params.qid, body));

route('GET', '/api/jobs', () => jobs.listJobs());
route('GET', '/api/jobs/:id', ({ params }) => jobs.getJob(params.id) || { error: 'not found' });
route('POST', '/api/jobs/playwright', ({ body }) => {
  const target = S.playwrightTarget(body.project, body.env);
  return leanJob(jobs.startPlaywrightJob(body, target, (j) => broadcast('job', leanJob(j))));
});
route('POST', '/api/jobs/:id/cancel', ({ params }) => ({ cancelled: jobs.cancelJob(params.id) }));

route('POST', '/api/report', () => {
  buildMissingRunReports();
  const r = buildHtmlReport();
  return { url: '/report', kb: r.kb };
});

// ---------------------------------------------------------------- server
async function handle(req, res) {
  const host = String(req.headers.host || '').toLowerCase();
  if (!/^(127\.0\.0\.1|localhost)(:\d+)?$/.test(host)) return send(res, 403, { error: 'Forbidden host' }); // DNS-rebinding guard
  const url = new URL(req.url, `http://${host}`);
  const p = url.pathname;
  if (p === '/api/events') {
    res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-store', connection: 'keep-alive' });
    res.write(`event: hello\ndata: ${JSON.stringify({ version: VERSION, sandboxed: jobs.SANDBOXED })}\n\n`);
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return undefined;
  }
  if (p.startsWith('/api/')) {
    // Custom header blocks cross-site form posts and simple CORS requests from other websites.
    if (req.method !== 'GET' && req.headers['x-qa-app'] !== '1') return send(res, 403, { error: 'Missing X-QA-App header' });
    const r = match(req.method, p);
    if (!r) return send(res, 404, { error: `No route for ${req.method} ${p}` });
    try {
      const body = req.method === 'GET' ? null : await readBody(req);
      const data = await r.handler({ params: r.params, body: body || {}, query: Object.fromEntries(url.searchParams) });
      return send(res, 200, data ?? { ok: true });
    } catch (e) {
      if (!e.status) console.error(e);
      return send(res, e.status || 500, { error: e.message });
    }
  }
  if (p.startsWith('/files/')) {
    const abs = S.resolveFile(p.slice('/files/'.length));
    return abs ? sendFile(res, abs) : send(res, 404, { error: 'File not found' });
  }
  if (p === '/report') {
    // Served under /files/ so its relative links to each run's report.html resolve.
    if (!fs.existsSync(path.join(REPORTS, 'index.html'))) { buildMissingRunReports(); buildHtmlReport(); }
    res.writeHead(302, { location: '/files/reports/index.html' });
    return res.end();
  }
  const rr = /^\/run-report\/([^/]+)\/([^/]+)$/.exec(p);
  if (rr) {
    const [slug, runId] = [decodeURIComponent(rr[1]), decodeURIComponent(rr[2])];
    try { S.getRun(slug, runId); } catch (e) { return send(res, e.status || 404, { error: e.message }); }
    if (!S.runReport(slug, runId, true)) return send(res, 500, { error: 'Could not build the run report' });
    res.writeHead(302, { location: `/files/projects/${encodeURIComponent(slug)}/runs/${encodeURIComponent(runId)}/report.html` });
    return res.end();
  }
  const rel = p === '/' ? 'index.html' : decodeURIComponent(p).replace(/^\/+/, '');
  const abs = path.resolve(PUBLIC, rel);
  if (!abs.startsWith(PUBLIC) || !fs.existsSync(abs) || !fs.statSync(abs).isFile()) return send(res, 404, { error: 'Not found' });
  return sendFile(res, abs);
}

function openBrowser(url) {
  const cmd = process.platform === 'win32' ? ['cmd', ['/c', 'start', '', url]] : process.platform === 'darwin' ? ['open', [url]] : ['xdg-open', [url]];
  try { spawn(cmd[0], cmd[1], { detached: true, stdio: 'ignore', windowsHide: true }).unref(); } catch { /* user can open it manually */ }
}

export function startServer({ port = 7358, open = false } = {}) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      handle(req, res).catch((e) => { console.error(e); if (!res.headersSent) send(res, 500, { error: e.message }); });
    });
    const url = `http://127.0.0.1:${port}/`;
    server.on('error', (e) => {
      if (e.code === 'EADDRINUSE') {
        console.log(`Test Manager is already running at ${url}`);
        if (open) openBrowser(url);
        resolve(null);
      } else throw e;
    });
    server.listen(port, '127.0.0.1', () => {
      watchWorkspace();
      setInterval(() => { for (const res of clients) res.write(': ping\n\n'); }, 25000).unref();
      console.log(`Test Manager running at ${url}`);
      console.log(`Workspace: ${ROOT}`);
      if (jobs.SANDBOXED) console.log('Running inside a sandbox: Playwright runs are disabled here. Start the app from your own terminal to run them.');
      console.log('Press Ctrl+C to stop.');
      if (open) openBrowser(url);
      resolve(server);
    });
  });
}
