// Playwright reporter: records every run as a Test Manager run in projects/<slug>/runs/<stamp>_<env>_playwright/
// (results.json + report.md + report.html, screenshots and failure traces), so terminal, CI and app runs all show up.
// The owning project comes from the Playwright project's metadata (set in playwright.config.ts), else from the spec path.
import fs from 'node:fs';
import path from 'node:path';
import { PROJECTS, projectSlugs, loadProject, rel } from '../lib/workspace.mjs';
import { summarize, renderReport } from '../lib/report-md.mjs';
import { buildHtmlReport } from '../lib/html-report.mjs';
import { buildRunReport } from '../lib/run-report.mjs';

const stripAnsi = (s) => String(s || '').replace(/\u001b\[[0-9;]*m/g, '');
const pad = (n) => String(n).padStart(2, '0');
const stamp = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
const ID_RE = /^\s*([A-Z][A-Z0-9]*-\d+)\b[:\s-]*/;
const inside = (dir, file) => { const r = path.relative(dir, file); return r && !r.startsWith('..') && !path.isAbsolute(r); };

// Expect calls and test.step() blocks become the run's checks. Fixture setup (e.g. a login that
// saves a reusable session) is not part of what the test verifies, so its expects are left out.
function checksOf(steps, out = []) {
  for (const s of steps || []) {
    if (s.category === 'fixture') continue;
    if ((s.category === 'expect' || s.category === 'test.step') && out.length < 80) {
      out.push({ label: s.category === 'test.step' ? `Step: ${s.title}` : s.title, pass: !s.error, ...(s.error ? { actual: stripAnsi(s.error.message).split('\n').slice(0, 3).join(' ') } : {}) });
    }
    checksOf(s.steps, out);
  }
  return out;
}

export default class QaReporter {
  constructor() {
    this.start = new Date();
    this.buckets = new Map(); // `${slug}|${pwProject}` -> { slug, pwProject, baseUrl, tests }
  }

  printsToStdio() {
    return false;
  }

  onBegin() {
    this.start = new Date();
    this.projects = [];
    for (const slug of projectSlugs()) {
      try { const p = loadProject(slug); if (p.cfg) this.projects.push({ slug, cfg: p.cfg, specDir: p.specDir }); } catch { /* broken project.yaml: reported by lint */ }
    }
  }

  onTestEnd(test, result) {
    const pw = test.parent.project();
    const meta = pw?.metadata || {};
    const owner = this.projects.find((p) => p.slug === meta.slug) || this.projects.find((p) => inside(p.specDir, test.location.file));
    if (!owner) return;
    const key = `${owner.slug}|${pw?.name || 'default'}`;
    if (!this.buckets.has(key)) this.buckets.set(key, { owner, pwProject: pw?.name || 'default', env: meta.env, baseUrl: meta.baseUrl || pw?.use?.baseURL || '', tests: new Map() });
    const bucket = this.buckets.get(key);
    const rec = bucket.tests.get(test.id) || { test, attempts: [] };
    rec.attempts.push({
      status: result.status,
      duration: result.duration,
      error: stripAnsi(result.error?.message || ''),
      checks: checksOf(result.steps),
      attachments: result.attachments.filter((a) => a.path).map((a) => ({ name: a.name, path: a.path, contentType: a.contentType })),
    });
    bucket.tests.set(test.id, rec);
  }

  onEnd() {
    for (const { owner, pwProject, env: metaEnv, baseUrl, tests } of this.buckets.values()) {
      const { slug, cfg } = owner;
      const env = metaEnv || process.env.QA_ENV || cfg.defaultEnv || 'env';
      const variant = pwProject !== slug && pwProject.startsWith(slug + '-') ? pwProject.slice(slug.length) : ''; // e.g. -firefox
      let runId = `${stamp(this.start)}_${env}_playwright${variant}`;
      for (let i = 2; fs.existsSync(path.join(PROJECTS, slug, 'runs', runId)); i++) runId = `${stamp(this.start)}_${env}_playwright${variant}-${i}`;
      const runDir = path.join(PROJECTS, slug, 'runs', runId);
      fs.mkdirSync(path.join(runDir, 'screenshots'), { recursive: true });
      const out = [];
      for (const { test, attempts } of tests.values()) {
        const outcome = test.outcome();
        const status = outcome === 'skipped' ? 'skipped' : outcome === 'flaky' ? 'flaky' : outcome === 'expected' ? 'pass' : 'fail';
        const id = (ID_RE.exec(test.title) || [])[1] || test.titlePath().slice(2).join(' > ');
        const last = attempts[attempts.length - 1];
        // test.fail('BUG-001 ...'): a known product bug. It counts as a pass while the bug is still there.
        const knownBug = test.expectedStatus === 'failed' ? test.annotations.find((a) => a.type === 'fail') : undefined;
        const notes = knownBug ? [`Expected failure, known bug: ${knownBug.description || 'see the test'}`] : [];
        const bug = knownBug?.description?.match(/\bBUG-\d+\b/)?.[0];
        const evidence = [];
        attempts.forEach((a, ai) => {
          a.attachments.forEach((att, k) => {
            if (!fs.existsSync(att.path)) return;
            const isImage = att.contentType?.startsWith('image/');
            const keep = isImage || (['trace', 'video'].includes(att.name) && a.status !== 'passed');
            if (!keep) return;
            const sub = isImage ? 'screenshots' : 'traces';
            const file = `${id.replace(/[^\w.-]+/g, '_')}-a${ai + 1}-${k + 1}${path.extname(att.path)}`;
            fs.mkdirSync(path.join(runDir, sub), { recursive: true });
            fs.copyFileSync(att.path, path.join(runDir, sub, file));
            evidence.push(`${sub}/${file}`);
          });
        });
        out.push({
          id,
          title: test.title.replace(ID_RE, '').replace(/\s+@[\w-]+/g, '').trim(), // tags are kept in tags[]
          status,
          source: 'playwright',
          file: rel(test.location.file),
          tags: test.tags,
          startedAt: this.start.toISOString(),
          durationMs: attempts.reduce((sum, a) => sum + a.duration, 0),
          attempts: attempts.length,
          checks: last.checks,
          evidence,
          notes,
          ...(bug ? { bug } : {}),
          ...(status === 'fail' ? { error: last.error.slice(0, 800), failureType: 'untriaged' } : {}),
          ...(attempts.length > 1
            ? { history: attempts.slice(0, -1).map((a) => ({ status: a.status === 'passed' ? 'pass' : 'fail', failed: a.checks.filter((c) => !c.pass).map((c) => c.label), error: a.error.slice(0, 300) })) }
            : {}),
        });
      }
      out.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
      const results = {
        schema: 1,
        runner: 'playwright',
        project: slug,
        env,
        suite: process.env.QA_SUITE || 'playwright',
        ...(process.env.QA_PLAN ? { plan: process.env.QA_PLAN } : {}),
        baseUrl,
        runId,
        workers: [pwProject],
        startedAt: this.start.toISOString(),
        finishedAt: new Date().toISOString(),
        summary: summarize(out),
        tests: out,
        notes: `Playwright project "${pwProject}". Full Playwright HTML report: reports/playwright-html/index.html, open with npm run report (overwritten by the next run).`,
      };
      fs.writeFileSync(path.join(runDir, 'results.json'), JSON.stringify(results, null, 2));
      fs.writeFileSync(path.join(runDir, 'report.md'), renderReport(results));
      try { buildRunReport(slug, runId, { force: true }); } catch (e) { console.log(`[qa] run report not built: ${e.message}`); }
      const s = results.summary;
      console.log(`[qa] ${slug} (${pwProject}): ${s.pass} pass, ${s.fail} fail, ${s.flaky} flaky, ${s.skipped} skipped -> ${rel(runDir)}/report.md`);
    }
    if (!this.buckets.size) return;
    try {
      const html = buildHtmlReport();
      console.log(`[qa] overview report: ${rel(html.out)}`);
    } catch (e) {
      console.log(`[qa] overview report not updated: ${e.message}`);
    }
  }
}
