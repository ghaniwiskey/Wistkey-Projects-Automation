// Runs the Playwright POM suite for the web app and streams progress. Each job is one `playwright test` process
// using the repo's playwright.config.ts (one Playwright project per projects/<slug>; its reporter records the run in projects/<slug>/runs/).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { ROOT } from './workspace.mjs';

// Aside's sandbox cannot launch browsers; detect it so the UI can explain instead of failing silently.
export const SANDBOXED = /asidesandbox/i.test(os.tmpdir()) || /asidesandbox/i.test(process.env.LOCALAPPDATA || '');

const jobs = new Map();
let seq = 0;
const MAX_LOG = 3000;
const escRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function publicJob(j) {
  const { child, ...rest } = j;
  return { ...rest, log: rest.log.slice(-400) };
}

export function listJobs() {
  return [...jobs.values()].map((j) => ({ ...publicJob(j), log: undefined })).reverse();
}

export function getJob(id) {
  const j = jobs.get(id);
  return j ? { ...publicJob(j), log: j.log } : null;
}

// target: { pwProjects, env, baseUrl, allowWrites } from store.playwrightTarget()
export function startPlaywrightJob(opts, target, onUpdate) {
  const cli = [path.join(ROOT, 'node_modules', '@playwright', 'test', 'cli.js'), path.join(ROOT, 'node_modules', 'playwright', 'cli.js')].find((f) => fs.existsSync(f));
  if (!cli) throw Object.assign(new Error('Playwright is not installed. Run "npm install" in the project.'), { status: 400 });
  const ids = (opts.ids || []).filter((x) => /^[A-Z][A-Z0-9]*-\d+$/.test(x));
  const args = [...process.execArgv, cli, 'test', ...target.pwProjects.map((n) => `--project=${n}`)];
  if (ids.length) args.push(`--grep=${ids.map((x) => escRe(x) + ':').join('|')}`);
  else if (opts.grep) args.push(`--grep=${opts.grep}`);
  // Read-only envs skip @writes tests through grepInvert in playwright.config.ts.
  if (opts.workers) args.push(`--workers=${Number(opts.workers)}`);
  if (opts.headed) args.push('--headed');
  const env = {
    ...process.env, QA_LIVE: '1', FORCE_COLOR: '0', QA_ENV: target.env,
    QA_SUITE: opts.suite || (opts.plan ? opts.plan.toLowerCase() : 'playwright'), QA_PLAN: opts.plan || '', PLAYWRIGHT_HTML_OPEN: 'never',
  };
  const job = {
    id: `job-${Date.now().toString(36)}-${++seq}`, kind: 'playwright', project: opts.project, env: target.env, ids, grep: opts.grep || null,
    plan: opts.plan || null, headed: !!opts.headed, status: 'running', startedAt: new Date().toISOString(), finishedAt: null,
    total: 0, tests: {}, runIds: [], log: [], error: null, sandboxed: SANDBOXED,
  };
  const push = (line) => {
    job.log.push(line);
    if (job.log.length > MAX_LOG) job.log.splice(0, job.log.length - MAX_LOG);
  };
  push(`> playwright ${args.slice(process.execArgv.length + 1).join(' ')}   (QA_ENV=${target.env}, ${target.baseUrl})`);
  if (SANDBOXED) push('Note: this app is running inside a sandbox where browsers cannot start. Start it from your own terminal (Start Test Manager.cmd or npm run tm) to run Playwright.');
  let child;
  try {
    child = spawn(process.execPath, args, { cwd: ROOT, env, windowsHide: true });
  } catch (e) {
    job.status = 'error';
    job.error = e.message;
    jobs.set(job.id, job);
    onUpdate(job);
    return job;
  }
  job.pid = child.pid;
  Object.defineProperty(job, 'child', { value: child, enumerable: false });
  jobs.set(job.id, job);
  let buf = '';
  let lastEmit = 0;
  const emit = (force) => {
    const now = Date.now();
    if (force || now - lastEmit > 300) { lastEmit = now; onUpdate(job); }
  };
  const onData = (chunk) => {
    buf += chunk.toString();
    let i;
    while ((i = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, i).replace(/\r$/, '');
      buf = buf.slice(i + 1);
      if (line.startsWith('@@qa ')) {
        try {
          const ev = JSON.parse(line.slice(5));
          if (ev.type === 'begin') { job.total = ev.total; for (const t of ev.tests) job.tests[t.id] = { status: 'queued', title: t.title }; }
          else if (ev.type === 'testBegin') job.tests[ev.id] = { ...(job.tests[ev.id] || {}), status: 'running', retry: ev.retry };
          else if (ev.type === 'testEnd') {
            const final = ev.outcome === 'flaky' ? 'flaky' : ev.status === 'passed' ? 'pass' : ev.status === 'skipped' ? 'skipped' : ev.retry < 1 && ev.outcome === 'unexpected' ? 'retrying' : 'fail';
            job.tests[ev.id] = { ...(job.tests[ev.id] || {}), status: final, durationMs: ev.durationMs, error: ev.error, retry: ev.retry };
          } else if (ev.type === 'error') job.error = ev.message;
          else if (ev.type === 'end') job.result = ev.status;
        } catch { push(line); }
        emit(true);
        continue;
      }
      push(line);
      const m = /runs\/([^/\s]+)\/report\.md/.exec(line);
      if (m && !job.runIds.includes(m[1])) job.runIds.push(m[1]);
      emit(false);
    }
  };
  child.stdout.on('data', onData);
  child.stderr.on('data', onData);
  child.on('error', (e) => { job.status = 'error'; job.error = e.message; emit(true); });
  child.on('close', (code) => {
    if (buf) onData('\n');
    job.exitCode = code;
    job.finishedAt = new Date().toISOString();
    if (job.status === 'running') job.status = job.cancelled ? 'cancelled' : code === 0 ? 'passed' : 'failed';
    for (const t of Object.values(job.tests)) if (t.status === 'retrying') t.status = 'fail';
    emit(true);
  });
  // Playwright normally starts printing within seconds; inside the sandbox it can hang, so stop it.
  if (SANDBOXED) {
    setTimeout(() => {
      if (job.status === 'running' && !Object.values(job.tests).some((t) => t.status !== 'queued')) {
        push('Stopped: no test started within 30 seconds (browsers cannot launch inside the sandbox).');
        cancelJob(job.id);
      }
    }, 30000);
  }
  onUpdate(job);
  return job;
}

export function cancelJob(id) {
  const j = jobs.get(id);
  if (!j || j.status !== 'running' || !j.child) return false;
  j.cancelled = true;
  if (process.platform === 'win32') spawn('taskkill', ['/pid', String(j.pid), '/T', '/F'], { windowsHide: true });
  else j.child.kill('SIGTERM');
  return true;
}

export function runningJobs() {
  return [...jobs.values()].filter((j) => j.status === 'running').length;
}
