# Test Manager

Local web app for test cases, runs, test plans, bugs and open questions across every project in `projects/`, wired to each project's **Playwright POM suite**. No other test framework is involved: automated runs are plain `playwright test --project=<slug>` with the root `playwright.config.ts`.

```powershell
npm run tm                    # start at http://127.0.0.1:7358/ and open the browser (or "Start Test Manager.cmd")
.\qa help                     # the CLI (test-manager/cli.mjs): run, check, one-line views, store calls
.\qa new <slug> --url <baseUrl> [--name "App"] [--env staging] [--prefix APP] [--read-only]
.\qa lint                     # quality checks for test cases, POM specs, bugs, plans, questions
.\qa report                   # rebuild the overview report reports/index.html
```

It runs on this PC only (binds to 127.0.0.1, no login). Port: `--port` or `QA_APP_PORT`.

## How it fits together

Project folder layout: root `README.md` > Structure. The Test Manager itself:

```
test-manager/
  server.mjs, cli.mjs          web server (REST + live updates) and CLI (.\qa)
  lib/                         data layer (store.mjs, workspace.mjs = paths), lint, Markdown and HTML reports
  reporters/qa-reporter.mjs    Playwright reporter: records every run in projects/<slug>/runs/
  reporters/live-reporter.mjs  live progress for runs started from the app (only when QA_LIVE=1)
  run-auto.mjs                 .\qa auto / npm run test:auto (one retry, sorts results, writes heal requests)
  public/                      UI (Preact + htm, no build step)
```

- **Playwright projects**: `playwright.config.ts` creates one Playwright project per `projects/<slug>` (named `<slug>`; extra browsers become `<slug>-firefox`, `<slug>-webkit`, `<slug>-mobile`). Its `metadata.slug` tells the reporter which project a result belongs to.
- **Linking**: a test case `SHOP-001` is "automated" when a test title in `projects/shop/tests/e2e` starts with `SHOP-001:`. Its code shows on the test case page; its results show in history, plans and reports.
- **Runs from the app**: Playwright tab runs `playwright test --project=<slug> --grep "SHOP-001:|..."` with `QA_ENV` set to the chosen environment. Envs with `allowWrites: false` skip `@writes` tests (grepInvert in the config). Manual tab lets a tester step through the case, mark steps and expected results, and paste screenshots.
- **Quick results**: to just mark a case without stepping through it, use **Record result** (Pass / Fail / Blocked / Skip) on the test case page, the Pass / Fail / Skip buttons in the list's Last result column, or select several cases and **Mark pass / fail / blocked / skipped**. Pick the environment, add a note (required for a fail) and optionally a bug ID. It is saved as a finished manual run (suite `quick`), so history, Last result, plans and reports count it. CLI: `.\qa call recordResults <slug> @r.json` with `{ ids, status, env?, note?, bug? }`.
- **Not run**: the same places have a **Not run** button (list: **Mark not run** for a selection) that sets cases back to Not run, e.g. before a retest cycle. It saves a finished manual run (suite `reset`, results `untested` with `reset: true`); earlier results stay in history and their runs, but last result, filters, plans and reports count the case as not run until its next result. CLI: `.\qa call resetResults <slug> ids=SCG-001`.
- **Runs from a terminal or CI**: any Playwright run lands in `projects/<slug>/runs/` (results.json, report.md, screenshots; traces and report.html stay local and report.html is rebuilt when opened), so the app and reports count them.
- **Live**: the app watches `projects/` and `shared/`, so edits to test cases, specs or page objects show up without a reload.

## Writing an automated test case

Create the case in the app (or `.\qa call createTest`), then add page objects, a fixture entry and a spec titled `<ID>: ...` (`.agents/skills/qa-write-tests`, Part B). `.\qa lint` checks the link and the POM rules: no `page.locator()` in specs, no `waitForTimeout`, no `.only`, imports exist, IDs unique, no imports from another project.

## Bugs and Questions sorting

Both lists default to **Most recent**, with **Oldest first** and the original severity/status order available in **Sort by**. Activity uses the latest recorded updated, found, answered or History date, not filesystem modification times. Same-date items use numeric IDs as a tie-breaker; undated records appear last. App edits persist an exact update timestamp. Status filters work independently of sorting.

Focused regression checks: `node --test test-manager/tests/issue-sort.test.mjs`.

Bug and question dates display as `YYYY-MM-DD HH:mm` (24-hour, browser-local timezone) in lists and detail headers when a timestamp is available. New bugs/questions and answer status changes store full timestamps; older date-only records remain date-only because their time was not recorded.
