# Wistkey Projects Automation

**AI-assisted QA automation built and operated with [Aside](https://asidehq.com), the AI browser.** Aside explores the apps in its own browser, writes test cases and Page Object Model Playwright tests, runs the suites, triages failures and files bugs, all from plain-language requests in chat.

One Playwright setup for several apps under test. Each app is a self-contained folder in `projects/` with its own Page Object Model suite and its own test management data; one `playwright.config.ts` turns every project into a Playwright project. A local **Test Manager** web app manages test cases, runs, plans and bugs on top of it.

## How Aside fits in

Aside is the QA engineer at the keyboard; Playwright is the test runner. The tests are standard `@playwright/test` code, so they run the same from Aside, a terminal or CI, with no Aside dependency.

| You say | Skill (`.agents/skills/`) | What Aside does |
|---|---|---|
| "Write test cases for asset assignment in mha-spf" (+ ticket, manual section or page) | `qa-write-tests` Part A | Designs cases from the source, writes them through the Test Manager store, lints |
| "Automate SPF-002" | `qa-write-tests` Part B | Page objects, fixture, spec titled `SPF-002: ...`, two green runs |
| "Run the scg-store smoke tests" / "retest BUG-003" | `qa-run-tests` | Runs Playwright, triages failures (product-bug / test-issue / environment), fixes stale page objects, files or links bugs |
| "Explore the cart for 20 minutes" | `qa-explore` | Charter-based bug hunt in Aside's browser; bugs, cases and session notes in `projects/<slug>/explorations/` |

Rules for cases, results, triage, bugs, safety and notes: [docs/conventions.md](docs/conventions.md). Without Aside everything still works by hand: the commands below, the Test Manager app and the docs.

## Setup

```bash
npm install
npx playwright install chromium
cp .env.example .env   # then fill in the credentials (SCG_EMAIL / SCG_PASSWORD, ...)
```

## Run

PowerShell entry point `.\qa` (`qa.ps1`; calls node.exe directly, so arguments such as `--grep "A:|B:"` survive). `.\qa help` lists every command.

```powershell
.\qa auto                                   # run, then ask for AI only if a test is really broken (below); npm run test:auto
.\qa test                                   # every project, each on its defaultEnv; npm test
.\qa test --project=scg-store --grep '@smoke'   # one project, one suite (quote @smoke in PowerShell)
.\qa test --headed / --ui                   # headed, UI mode
npm run report                              # last Playwright HTML report
npm run tm                                  # Test Manager at http://127.0.0.1:7358/ (or "Start Test Manager.cmd")
.\qa check                                  # typecheck + lint (run before every commit)
.\qa tests|bugs|questions|runs <slug>       # one line per item; .\qa failures <slug> for a run's failures
```

Env switches: `$env:QA_ENV='staging'` (run every project on that env), `$env:SCG_BASE_URL='https://...'` (override one project's URL, `<PREFIX>_BASE_URL`), `$env:QA_WORKERS=2` (default 1, since projects may share test accounts), `$env:QA_AUTH_MAX_AGE_MIN=0` (always log in again, see below).

## Run tests, use AI only when something broke

`.\qa auto` (or double-click **Run Tests.cmd**; Playwright arguments pass through, e.g. `.\qa auto --project=scg-store --grep '@smoke'`) runs plain Playwright on this PC with one retry. No AI is involved, and nothing starts Aside on its own. Afterwards it sorts the results:

| Result | What happens | Exit code |
|---|---|---|
| All passed (flaky = passed on the retry, listed but fine) | "All good. No AI needed." | 0 |
| Only environment problems (site firewall 403, site down, 5xx, missing `.env` values) | Marked `environment` in the run automatically; rerun later | 2 |
| Broken (failed twice, not the environment) | Saves a heal request `reports/heal/<stamp>.json` and copies a prompt to the clipboard: *Heal the broken tests in reports/heal/...* | 1 |

Paste that prompt into an Aside task in this project when you want the tests fixed. Aside (`qa-run-tests`, Heal mode) works only on those tests: reproduces each failure in its browser, fixes outdated page objects or files a bug for a real product problem, reruns until green, then commits and pushes. When you ask Aside to "run the tests", it uses the same script and stops with a short summary if nothing is broken.

## Login sessions (log in once, reuse)

Tests that need a logged-in user but are not testing the login itself start already logged in. They opt in through their project's fixture:

```ts
test.use({ role: 'logs1' });   // mha-spf / mha-hta: logged in, LOGS1 active, on the dashboard
test.use({ loggedIn: true });  // scg-store: logged in as the SCG test account
```

- The first such test logs in once through the page objects and saves the session (cookies + localStorage) to `playwright/.auth/<project>/<env>/<account>.json` (gitignored). Later tests and later runs reuse it for up to 30 minutes (`QA_AUTH_MAX_AGE_MIN`), after checking it is still valid; otherwise they log in again. Fewer logins means faster runs and fewer requests to sites with a firewall (SCG).
- Tests of the login itself (SCG-001, SPF-001) do not opt in and start logged out.
- **MHA allows one session per account.** Any newer login of the same account (SPF-001, a person, Aside's browser) ends the saved session; the `role` fixture notices (role switch lands on the login page), logs in again and re-saves the session.
- Shared code: `shared/auth/session.ts` (`savedSession`, `resaveSession`, `forgetSession`). New projects copy the pattern from `projects/scg-store/tests/fixtures/pages.fixture.ts`.

## Structure

```
playwright.config.ts           one Playwright project per projects/<slug>/project.yaml (name = slug)
qa.ps1                         PowerShell entry point: .\qa <command> (test-manager/cli.mjs)
tsconfig.json                  "@shared/*" import alias
shared/                        code for several projects (import from '@shared/...')
  pages/app.page.ts            generic base page (navigate + HTTP error check)
  utils/env.ts                 requireEnv() for credentials from .env
  auth/session.ts              log in once and reuse the session (storageState) across tests and runs
projects/
  _template/                   copied for new projects (Test Manager "New project" or .\qa new)
  scg-store/                   one app under test
    project.yaml               name, testIdPrefix (SCG), envs, Playwright options (browsers, viewport...), suites, accounts
    README.md (+ context.md)   app notes: envs, accounts, how to run; behavior, quirks, test data (docs/conventions.md > Knowledge files)
    tests/                     Playwright POM suite (.agents/skills/qa-write-tests Part B)
      e2e/<feature>/*.spec.ts  specs; titles start with the test case ID: 'SCG-001: ... @smoke'
      pages/*.page.ts          page objects: selectors and actions
      fixtures/                page objects as fixtures
      utils/                   test data
    cases/<feature>/           test cases  SCG-NNN-<slug>.md
    plans/ bugs/ questions/    test plans, bug reports, open questions
    runs/                      run results (results.json, report.md, screenshots; traces and report.html stay local)
    explorations/              exploratory session notes and screenshots
test-manager/                  Test Manager web app and CLI (see test-manager/README.md); run-auto.mjs = .\qa auto
Run Tests.cmd                  double-click: test:auto (test-manager/run-auto.mjs), no AI
docs/
  conventions.md               rules: cases, tags, priorities, severities, statuses, triage, bugs, questions, safety, notes, finishing
  exploratory-heuristics.md    test ideas by category (test design and exploratory sessions)
  templates/                   test-case.md, bug-report.md, explore-session.md
.agents/skills/                Aside skills: qa-write-tests, qa-run-tests, qa-explore
reports/                       generated, gitignored: index.html (overview across projects), playwright-html/ (npm run report),
                               test-results/ (attachments of the current run), heal/ (heal requests)
```

## Add a project

```powershell
.\qa new shop --url https://staging.shop.com/ --name "Shop" --prefix SHOP
.\qa test --project=shop      # the template's SHOP-001 home page smoke test
```

Or click **New project** in the Test Manager. You get `projects/shop/` with `project.yaml`, a POM skeleton (home page object, fixture, smoke spec) and its test case. Then add page objects and specs under `projects/shop/tests/`, keep shared code in `shared/`, and never import from another project (`.\qa lint` warns).

## Code rules in short

Selectors and actions live in page objects; specs read like user journeys and get page objects from fixtures (no `page.waitForTimeout`, no raw `page.locator()` in specs; lint checks). A Playwright test is linked to its test case by the `<PREFIX>-NNN` ID at the start of its title. Tags: `@smoke`, `@regression`, `@writes` (skipped on envs with `allowWrites: false`), `@final` (needs approval per run). Secrets only in `.env` (gitignored), named `<PREFIX>_...`.
