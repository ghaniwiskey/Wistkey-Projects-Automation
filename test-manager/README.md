# Test Manager

Local web app for test cases, runs, test plans, bugs and open questions across every project in `projects/`, wired to each project's **Playwright POM suite**. No other test framework is involved: automated runs are plain `playwright test --project=<slug>` with the root `playwright.config.ts`.

```bash
npm run tm                    # start at http://127.0.0.1:7358/ and open the browser (or "Start Test Manager.cmd")
npm run tm:new -- <slug> --url <baseUrl> [--name "App"] [--env staging] [--prefix APP] [--read-only]
npm run tm:lint               # quality checks for test cases, POM specs, bugs, plans
npm run tm:report             # rebuild the overview report reports/index.html
```

It runs on this PC only (binds to 127.0.0.1, no login). Port: `--port` or `QA_APP_PORT`.

## How it fits together

```
projects/<slug>/
  project.yaml                 envs (baseUrl, allowWrites), playwright (testDir, browsers, fullyParallel, use), suites, accounts
  tests/e2e/<feature>/         Playwright specs; a test title starts with its test case ID:  test('SHOP-001: ... @smoke', ...)
  tests/pages, fixtures, utils page objects, fixtures, test data
  cases/<feature>/             test cases  <PREFIX>-<NNN>-<slug>.md
  plans/                       PLAN-<NNN>-*.yaml (scope by tags or IDs, progress, sign-off)
  bugs/                        BUG-<NNN>-*.md
  questions/                   Q-<NNN>-*.md open questions for the product owner (open | answered | closed)
  runs/<run>/                  results.json, report.md, report.html, screenshots/, traces/
  archive/cases/               archived test cases (IDs are never reused)
projects/_template/            copied by "New project" / tm:new ({{name}}, {{prefix}}, ... are filled in)
shared/                        cross-project helpers (@shared/...)
reports/index.html             overview report (generated)
test-manager/
  server.mjs, cli.mjs          web server (REST + live updates) and CLI
  lib/                         data layer (workspace.mjs = paths), lint, HTML reports
  reporters/qa-reporter.mjs    Playwright reporter: records every run in projects/<slug>/runs/
  reporters/live-reporter.mjs  live progress for runs started from the app (only when QA_LIVE=1)
  public/                      UI (Preact + htm, no build step)
```

- **Playwright projects**: `playwright.config.ts` creates one Playwright project per `projects/<slug>` (named `<slug>`; extra browsers become `<slug>-firefox`, `<slug>-webkit`, `<slug>-mobile`). Its `metadata.slug` tells the reporter which project a result belongs to.
- **Linking**: a test case `SHOP-001` is "automated" when a test title in `projects/shop/tests/e2e` starts with `SHOP-001:`. Its code shows on the test case page; its results show in history, plans and reports.
- **Runs from the app**: Playwright tab runs `playwright test --project=<slug> --grep "SHOP-001:|..."` with `QA_ENV` set to the chosen environment. Envs with `allowWrites: false` skip `@writes` tests (grepInvert in the config). Manual tab lets a tester step through the case, mark steps and expected results, and paste screenshots.
- **Runs from a terminal or CI**: any `npx playwright test` lands in `projects/<slug>/runs/`, so the app and reports count them.
- **Live**: the app watches `projects/` and `shared/`, so edits to test cases, specs or page objects show up without a reload.

## Writing an automated test case

1. Create the test case in the app (or a Markdown file in `projects/<slug>/cases/<feature>/`). It gets the next ID, for example `SCG-002`.
2. Add or extend page objects in `projects/<slug>/tests/pages` (selectors and actions only there; generic helpers in `shared/`).
3. Write the spec in `projects/<slug>/tests/e2e/<feature>/`, using the project's fixtures:
   ```ts
   import { test, expect } from '../../fixtures/pages.fixture';

   test('SCG-002: guest sees search results @regression', async ({ loginPage }) => {
     await loginPage.navigate('/');
     await loginPage.search('plug');
   });
   ```
4. `npm run tm:lint` checks the link and the POM rules: no `page.locator()` in specs, no `waitForTimeout`, no `.only`, imports exist, IDs unique, no imports from another project.

## Bugs and Questions sorting

Both lists default to **Most recent**, with **Oldest first** and the original severity/status order available in **Sort by**. Activity uses the latest recorded updated, found, answered or History date, not filesystem modification times. Same-date items use numeric IDs as a tie-breaker; undated records appear last. App edits persist an exact update timestamp. Status filters work independently of sorting.

Focused regression checks: `node --test test-manager/tests/issue-sort.test.mjs`.
