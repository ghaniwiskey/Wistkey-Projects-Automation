---
name: "qa-run-tests"
description: "Run the Playwright POM test suites of projects in this workspace (by project, suite tag, test IDs, priority, or test plan), triage failures (product-bug, test-issue, environment), fix stale page objects, file or link bugs, retest bug fixes, and report. Use when the user asks to run, re-run, smoke test, regression test, retest a bug, triage a failed run, or verify a deploy."
---

# Run tests and triage

Rules: `docs/conventions.md` (statuses, failure types, bugs). Everything runs as plain Playwright with the root `playwright.config.ts`; every run is recorded in `projects/<slug>/runs/<stamp>_<env>_playwright/` by the qa-reporter.

Node: `npx` fails in this shell. Use `$node = 'C:\Users\USER\.aside\runtime\node\node.exe'` from the workspace root. `TM` below = `& $node --input-type=module -e "const s=await import('./test-manager/lib/store.mjs'); ..."`.

## 1. Scope

- Project = `--project=<slug>` (all projects: omit it). Env = `defaultEnv` in project.yaml unless the user names one (`$env:QA_ENV`).
- Selection:
  | Ask | Flag |
  |---|---|
  | smoke / regression | `--grep @smoke` |
  | specific tests | `--grep "SCG-001:\|SCG-004:"` |
  | priority (P0, ...) | list the IDs first: `TM ... s.listTests('<slug>').filter(t=>t.automated && t.priority==='P0').map(t=>t.id)`, then grep them |
  | a test plan | `$env:QA_PLAN='PLAN-001'` plus the plan's scope (`s.getPlan('<slug>','PLAN-001')`) |
  | a bug retest | the IDs in the bug's `tests:` list |
- Name the run's suite with `$env:QA_SUITE='smoke'` (default `playwright`).
- Read-only envs (`allowWrites: false`) skip `@writes` tests automatically. Do not override that.
- Manual-only cases (`automated: false`) cannot run here. List them in the report as not run, and offer to automate them (qa-write-tests, Part B) or to step through them in the Test Manager's Manual run.
- Check the project's README/context for run warnings first (shared test accounts: keep `workers` at 1; MHA UAT writes send emails).

## 2. Run

```powershell
$env:QA_ENV='staging'; $env:QA_SUITE='smoke'   # only when needed; clear them after: Remove-Item Env:QA_SUITE
& $node node_modules/playwright/cli.js test --project=<slug> --grep @smoke
```
- Long suites: start with `yield_ms` and poll. The reporter prints `[qa] <slug> (...): N pass, N fail ... -> projects/<slug>/runs/<runId>/report.md`.
- Headed debugging for the user: `--headed`. Never commit `.only`.

## 3. Read the results

- `projects/<slug>/runs/<runId>/results.json`: per test `status`, `error`, `checks` (each `expect` / `test.step`), `evidence` (screenshots, failure traces), `attempts`, `history`.
- `reports/test-results/<test-folder>/error-context.md` (written for failed tests): the page's accessibility snapshot at the moment of failure (overwritten by the next run). It is often the fastest way to see what the page actually showed.
- Look at the failure screenshot before deciding anything.

## 4. Triage every failure

1. **Rerun the failed test once** (`--grep "<ID>:"`). Passes now: report it as flaky and look for the cause (missing wait in a page object, shared data). Do not hide it.
2. **Reproduce by hand** in Aside's browser (`openTab(baseUrl)`, follow the case's steps with `snapshot`), or read the error and screenshot when the cause is obvious:
   - Fails by hand too -> **product-bug**.
   - Works by hand (selector changed, text changed, new modal, timing) -> **test-issue**. Fix it in the **page object** (selectors, waits, quirk handling), not by adding locators or waits to the spec. If the expected behavior really changed, update the case's Steps/Expected too (bump `updated:`) and ask the user when unsure whether a change is intended.
   - Cannot reach the starting point (site down, 403/WAF, account locked, data or stock missing) -> **environment**. Stop rerunning against a blocking WAF; tell the user.
3. **Record the triage** on the run (same as the Test Manager's triage buttons; re-renders the reports):
   ```powershell
   TM ... s.triageRunTest('<slug>', '<runId>', '<ID>', { failureType: 'product-bug', bug: 'BUG-002', note: 'Badge stays at 0; API 200' })
   ```
4. **Product bug:** search open bugs for the same symptom (`s.listBugs('<slug>').filter(b=>b.status==='open')`, then read the likely ones). Link an existing bug instead of filing a duplicate. Otherwise file one (format: `docs/templates/bug-report.md`):
   ```powershell
   TM ... console.log(JSON.stringify(s.createBug('<slug>', {
     title: 'Cart badge does not update after adding a product from search', severity: 'major',
     env: 'staging', url: 'https://...', foundBy: 'runs/<runId>', tests: ['SCG-001'], frequency: 'always',
     summary: '...', steps: ['Log in as the test account', 'Search for ...', 'Click Add to Cart'],
     expected: '...', actual: '... (quote exact text)',
     evidence: ['Screenshot: ![failure](../runs/<runId>/screenshots/<file>.png)', 'Failed request: POST /api/cart 400 Not enough quantity'] })))
   ```
   Then triage the result with the new bug ID.
5. **After fixing a test-issue,** rerun the test until it passes twice. The new run supersedes the old one in the reports.

## 5. Bug retests

Rerun the tests in the bug's `tests:` list. All pass -> `s.updateBug('<slug>', 'BUG-002', { status: 'verified', note: 'Retest passed in runs/<runId>' })`. Still failing -> `{ status: 'open', note: 'Still fails in runs/<runId>' }`. Only the user or a developer sets `fixed`.

## 6. Report

- Verdict and counts (pass / fail / flaky / skipped), each failure with its failure type and bug link, manual-only cases not run, page object fixes made.
- Copy `projects/<slug>/runs/<runId>/report.html` into the session artifacts folder (e.g. `<runId>-report.html`) and mention it. Show the most important failure screenshot.
- Write back what you learned: site quirks in the project's README/context, stale steps in cases.
- Several projects: run them in one command (no `--project`) or one subagent per project, then summarize per project.
