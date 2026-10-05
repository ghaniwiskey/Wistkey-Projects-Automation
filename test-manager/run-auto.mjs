// Run the Playwright suites with no AI involved, and only ask for Aside when something is really broken.
//
//   npm run test:auto                                   every project, each on its defaultEnv
//   npm run test:auto -- --project=scg-store --grep @smoke   any Playwright CLI arguments pass through
//   (or double-click "Run Tests.cmd")
//
// 1. Runs `playwright test` with one retry (unless you pass --retries). The qa-reporter records every run
//    in projects/<slug>/runs/ as usual.
// 2. Sorts the results:
//      passed / flaky (failed, then passed on the retry)  -> done, nothing else happens
//      environment (site firewall 403, site down, 5xx, missing .env values) -> triaged as "environment"
//                  automatically in the run; no point asking an AI to fix code for that
//      broken (failed twice, not an environment problem)  -> writes a heal request
// 3. A heal request is reports/heal/<stamp>.json. Nothing is started: the script prints a one-line prompt
//    (and copies it to the clipboard on Windows) that you paste into Aside when you want the tests fixed.
//    Aside's qa-run-tests skill ("Heal mode") picks up the newest pending request.
//
// Exit code: 0 = all passed (flaky allowed), 1 = broken tests (heal request written),
//            2 = only environment problems, 3 = Playwright produced no results (see its output).
import { spawn, spawnSync } from 'node:child_process';
import readline from 'node:readline';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, PROJECTS, REPORTS, rel, stamp } from './lib/workspace.mjs';
import { triageRunTest } from './lib/store.mjs';

// Failures caused by the environment, not by the app's behavior or the test code.
const ENVIRONMENT = [
  [/site firewall|got HTTP 403/i, 'site firewall blocked this PC (HTTP 403)'],
  [/got HTTP 5\d\d|responds without an HTTP error/i, 'site returned an HTTP error'],
  [/net::ERR_|ECONNREFUSED|ENOTFOUND|getaddrinfo|ERR_NAME_NOT_RESOLVED|ERR_CONNECTION/i, 'site unreachable'],
  [/in \.env or the environment/i, 'missing credentials in .env'],
];

// A --reporter on the command line replaces the config's reporters; keep the qa-reporter so the run is recorded.
const QA_REPORTER = './test-manager/reporters/qa-reporter.mjs';
const args = process.argv.slice(2).map((a) => (a.startsWith('--reporter=') && !a.includes('qa-reporter') ? `${a},${QA_REPORTER}` : a));
const pwArgs = ['test', ...(args.some((a) => a.startsWith('--retries')) ? [] : ['--retries=1']), ...args];
const cli = path.join(ROOT, 'node_modules', 'playwright', 'cli.js');

const runs = new Map(); // `${slug}|${runId}` -> { slug, runId }
const RUN_LINE = /^\[qa\] ([\w-]+) \(.*\): .*-> projects\/([\w-]+)\/runs\/([^/]+)\/report\.md/;

const child = spawn(process.execPath, [cli, ...pwArgs], { cwd: ROOT, stdio: ['inherit', 'pipe', 'inherit'], env: process.env });
readline.createInterface({ input: child.stdout }).on('line', (line) => {
  process.stdout.write(line + '\n');
  const m = RUN_LINE.exec(line);
  if (m) runs.set(`${m[2]}|${m[3]}`, { slug: m[2], runId: m[3] });
});

child.on('close', (code) => {
  const passed = [];
  const flaky = [];
  const environment = [];
  const broken = [];

  for (const { slug, runId } of runs.values()) {
    const file = path.join(PROJECTS, slug, 'runs', runId, 'results.json');
    if (!fs.existsSync(file)) continue;
    const results = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const t of results.tests || []) {
      const item = { slug, runId, env: results.env, id: t.id, title: t.title, file: t.file, error: String(t.error || '').split('\n').map((s) => s.trim()).filter(Boolean).slice(0, 3).join(' | ').slice(0, 300) };
      if (t.status === 'pass') passed.push(item);
      else if (t.status === 'flaky') flaky.push(item);
      else if (t.status === 'fail') {
        const hit = ENVIRONMENT.find(([re]) => re.test(t.error || ''));
        if (hit) {
          environment.push({ ...item, reason: hit[1] });
          try { triageRunTest(slug, runId, t.id, { failureType: 'environment', note: `Auto-classified by test:auto: ${hit[1]}.` }); } catch { /* run still readable */ }
        } else broken.push(item);
      }
    }
  }

  const line = (s = '') => console.log(s);
  line();
  line('='.repeat(72));
  if (!runs.size) {
    line('No test results were recorded. Check the Playwright output above (config error, no matching tests?).');
    process.exit(code === 0 ? 0 : 3);
  }
  line(`test:auto  ${passed.length} passed, ${flaky.length} flaky, ${environment.length} environment, ${broken.length} broken`);
  for (const t of flaky) line(`  flaky        ${t.id}  ${t.title}  (passed on retry; see the run report)`);
  for (const t of environment) line(`  environment  ${t.id}  ${t.reason}`);
  for (const t of broken) line(`  BROKEN       ${t.id}  ${t.title}\n               ${t.error}`);

  if (broken.length) {
    const id = stamp();
    const dir = path.join(REPORTS, 'heal');
    fs.mkdirSync(dir, { recursive: true });
    const request = {
      id,
      createdAt: new Date().toISOString(),
      status: 'pending',
      command: ['npm run test:auto', ...(args.length ? ['--', ...args] : [])].join(' '),
      runs: [...runs.values()],
      tests: broken,
      environment,
      flaky,
    };
    const file = path.join(dir, `${id}.json`);
    fs.writeFileSync(file, JSON.stringify(request, null, 2));
    const prompt = `Heal the broken tests in ${rel(file)}`;
    let copied = false;
    if (process.platform === 'win32') copied = spawnSync('clip', { input: prompt }).status === 0;
    line();
    line(`Heal request saved: ${rel(file)}`);
    line(`To fix with Aside, open an Aside task in this project and say:${copied ? '  (copied to clipboard)' : ''}`);
    line(`  ${prompt}`);
    line('='.repeat(72));
    process.exit(1);
  }
  if (environment.length) {
    line();
    line('Only environment problems: nothing to fix in the tests. Rerun once the site is reachable again.');
    line('='.repeat(72));
    process.exit(2);
  }
  line('All good. No AI needed.');
  line('='.repeat(72));
  process.exit(0);
});
