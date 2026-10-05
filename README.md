# Wistkey Projects Automation

**AI-assisted QA automation built and operated with [Aside](https://asidehq.com), the AI browser.** Aside explores the apps in its own browser, writes test cases and Page Object Model Playwright tests, runs the suites, triages failures and files bugs, all from plain-language requests in chat.

One Playwright setup for several apps under test. Each app is a self-contained folder in `projects/` with its own Page Object Model suite and its own test management data; one `playwright.config.ts` turns every project into a Playwright project. A local **Test Manager** web app manages test cases, runs, plans and bugs on top of it.

## How Aside fits in

Aside is the QA engineer at the keyboard; Playwright is the test runner. The tests themselves are standard `@playwright/test` code, so they run the same from Aside, a terminal or CI, with no Aside dependency.

| Aside does | Using |
|---|---|
| Explores the live app in Aside's browser: maps pages, finds stable selectors, spots bugs and console/API errors | Aside browser (snapshots, screenshots, real user session) |
| Designs test cases from tickets, user manuals or the live page, in the project's format | `.agents/skills/qa-write-tests` + `docs/conventions.md` |
| Automates cases as POM Playwright tests: page objects, fixtures, specs linked by test ID | `qa-write-tests` (Part B) + `.agents/skills/playwright-e2e` |
| Runs suites, reproduces failures by hand in its browser, decides product-bug / test-issue / environment, fixes stale page objects, files or links bugs, retests fixes | `.agents/skills/qa-run-tests` |
| Runs time-boxed exploratory sessions and turns findings into bugs and new cases | `.agents/skills/qa-explore` + `docs/exploratory-heuristics.md` |
| Keeps project knowledge current (site quirks, waits, routes) and can schedule recurring runs | project `README.md` / `context.md`, Aside routines |

Just ask in Aside:

| You say | Skill |
|---|---|
| "Write test cases for asset assignment in mha-spf" (+ ticket, manual section or page) | `qa-write-tests`: designs cases, writes them via the Test Manager store, lints |
| "Automate SPF-002" | `qa-write-tests` Part B: page objects, fixture, spec titled `SPF-002: ...`, two green runs |
| "Run the scg-store smoke tests" / "retest BUG-003" | `qa-run-tests`: runs Playwright, triages failures, fixes stale page objects, files or links bugs |
| "Explore the cart for 20 minutes" | `qa-explore`: charter-based bug hunt in Aside's browser, session notes in `projects/<slug>/explorations/` |
| "Run the smoke tests every weekday at 8am" | an Aside routine that runs `qa-run-tests` on schedule |

Without Aside, everything below still works by hand: `npm test`, the Test Manager app, and the docs.

## Setup

```bash
npm install
npx playwright install chromium
cp .env.example .env   # then fill in the credentials (SCG_EMAIL / SCG_PASSWORD, ...)
```

## Run

```bash
npm test                                  # every project, each on its defaultEnv
npx playwright test --project=scg-store   # one project
npm run test:smoke                        # @smoke tests of every project
npm run test:headed / test:ui / report    # headed, UI mode, last HTML report
npm run tm                                # Test Manager at http://127.0.0.1:7358/ (or "Start Test Manager.cmd")
```

PowerShell env switches: `$env:QA_ENV='staging'` (run every project on that env), `$env:SCG_BASE_URL='https://...'` (override one project's URL, `<PREFIX>_BASE_URL`), `$env:QA_WORKERS=2` (default 1, since projects may share test accounts).

## Structure

```
playwright.config.ts           one Playwright project per projects/<slug>/project.yaml (name = slug)
tsconfig.json                  "@shared/*" import alias
shared/                        helpers for every project (import from '@shared/...')
  pages/app.page.ts            generic base page (navigate + HTTP error check)
  utils/env.ts                 requireEnv() for credentials from .env
projects/
  _template/                   copied for new projects (Test Manager "New project" or npm run tm:new)
  scg-store/                   one app under test
    project.yaml               name, testIdPrefix (SCG), envs, Playwright options (browsers, viewport...), suites, accounts
    README.md                  app notes and site quirks
    tests/                     Playwright POM suite (.agents/skills/playwright-e2e)
      e2e/<feature>/*.spec.ts  specs; titles start with the test case ID: 'SCG-001: ... @smoke'
      pages/*.page.ts          page objects: selectors and actions
      fixtures/                page objects as fixtures
      utils/                   test data
    cases/<feature>/           test cases  SCG-NNN-<slug>.md
    plans/ bugs/ runs/         test plans, bug reports, run results (written by the Playwright reporter)
test-manager/                  Test Manager web app (see test-manager/README.md)
docs/
  conventions.md               priorities, severities, statuses, failure types, test case and bug rules
  exploratory-heuristics.md    test ideas by category (test design and exploratory sessions)
  templates/                   test-case.md, bug-report.md, explore-session.md
.agents/skills/                Aside skills: playwright-e2e (POM code style), qa-write-tests, qa-run-tests, qa-explore
reports/                       generated, gitignored: index.html (overview across projects), playwright-html/ (npm run report),
                               test-results/ (scratch attachments of the current run), playwright-results.json
```

## Add a project

```bash
npm run tm:new -- shop --url https://staging.shop.com/ --name "Shop" --prefix SHOP
npx playwright test --project=shop      # the template's SHOP-001 home page smoke test
```

Or click **New project** in the Test Manager. You get `projects/shop/` with `project.yaml`, a POM skeleton (home page object, fixture, smoke spec) and its test case. Then add page objects and specs under `projects/shop/tests/`, keep shared code in `shared/`, and never import from another project (`npm run tm:lint` warns).

## Conventions

Full rules for test cases, results, triage and bugs: [docs/conventions.md](docs/conventions.md). The essentials:

- **POM**: selectors and actions live in page objects; specs read like user journeys and get page objects from fixtures. No `page.waitForTimeout`, no raw `page.locator()` in specs (lint checks).
- **Test IDs**: `<PREFIX>-NNN`, unique per project prefix. A Playwright test is linked to its test case by the ID at the start of its title.
- **Tags**: `@smoke`, `@regression`, `@writes` (skipped on envs with `allowWrites: false`).
- **Secrets**: only in `.env` (gitignored), named `<PREFIX>_...`. `project.yaml` lists usernames and variable names, never passwords.
