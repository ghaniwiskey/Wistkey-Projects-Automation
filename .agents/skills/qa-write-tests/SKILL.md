---
name: "qa-write-tests"
description: "Design and write test cases (Markdown in projects/<slug>/cases) for a project in this Playwright workspace from a feature description, user story, ticket, user manual, bug report, or the live app, and automate them as Page Object Model Playwright tests (page objects, fixtures, specs, selectors, waits, debugging). Use when the user asks to create, add, generate, review, or improve test cases or coverage, to automate a test case, or to write, review, or debug Playwright specs and page objects."
---

# Write test cases and automate them (POM)

Rules and allowed values: `docs/conventions.md`. Case format: `docs/templates/test-case.md` (the store writes it for you). Gap ideas: `docs/exploratory-heuristics.md`. Commands: `.\qa help`.

## Part A: design and write the cases

1. **Gather the source of truth:** requirement text, tickets (open them), the project's `README.md` and `context.md` plus the `context/<area>.md` you touch (MHA web: `shared/mha-ats/`, manual by module in `shared/mha-ats/docs/user-manual/`; read only the module you need), or the live app in Aside's browser (`openTab` + `snapshot(page, { interactive: true })`). Existing cases, so you do not write duplicates: `.\qa tests <slug>` (`--feature f`, `--grep text`).
2. **Design before writing.** Happy paths first (P0/P1), then validation, boundaries, errors, permissions/roles, state and persistence (P1/P2), cosmetic (P3). Use the heuristics for gaps. One behavior per case; merge near-duplicates; skip what existing cases cover. Show the plan (title, priority, tags) and wait for approval when there are more than 10 cases or the requirements are ambiguous.
3. **Write each case through the store** (exact ID, file name and format). Write the JSON to the session temp folder, then:
   ```powershell
   .\qa call createTest <slug> "@<tmp>\case.json"    # returns { id, file }: next free ID, cases/<feature>/<ID>-<slug>.md, automated: false
   ```
   ```json
   { "title": "Guest sees search results for a partial product name", "feature": "search", "priority": "P1",
     "tags": ["regression"], "envs": ["all"], "goal": "A guest can find products by typing part of the name.",
     "preconditions": [], "data": ["Query: plug"], "steps": ["Open the home page", "Search for plug"],
     "expected": ["The results page lists at least one product whose name contains \"Plug\""], "notes": "" }
   ```
   Case rules (user-language steps with concrete data, `<unique>` values, observable expectations, tags): conventions > Writing a test case. Editing an existing case: edit the Markdown and bump `updated:`.
4. **Validate:** `.\qa lint` shows 0 errors.
5. **Report:** cases added (ID, title, priority, tags), coverage gaps, open questions. Offer to automate them (Part B).

## Part B: automate a case (Page Object Model)

When the user asks, or for cases they approve. One case = one Playwright test.

1. **Read the suite first:** page objects (`tests/pages`; MHA web: `shared/mha-ats/pages`, HTA overrides in `projects/mha-hta/tests/pages`), `tests/fixtures/pages.fixture.ts`, `tests/utils/test-data.ts`, one existing spec as the style reference, and `shared/` (`@shared/pages/app.page`, `@shared/utils/env`, `@shared/auth/session`). Reuse existing methods.
2. **Selectors** from the live app (`snapshot`), in this order: `getByRole` > `getByLabel` > `getByPlaceholder` > `getByText` > `getByTestId` > CSS (last resort, with a comment saying why). No layout chains (`div > ul > li:nth-child(3)`).
3. **Page objects** (`tests/pages/<page>.page.ts`): locators as readonly fields, user-level methods (`addToCart()`, `filterByStatus(status)`), `expect...()` helpers for page-level checks. Waits for the app's quirks (hydration, spinners, modals, XHR refills) live here: wait for a state (`expect(locator).toBeVisible()`, `toHaveText`, `waitForResponse`), never `waitForTimeout` or `networkidle`. Extend the project's base page (`tests/pages/base.page.ts`) or `AppPage` from `@shared/pages/app.page`.
4. **Fixtures:** register new page objects in `tests/fixtures/pages.fixture.ts`; specs get them from fixtures (never `new` them in `beforeEach`).
   - **Login:** when the case only needs a logged-in user, use the project's session option at the top of the spec or describe block: `test.use({ role: '<role-slug>' })` (mha-spf/mha-hta: logged in, role active, on the dashboard) or `test.use({ loggedIn: true })` (scg-store). It logs in once through the page objects, saves cookies + localStorage to `playwright/.auth/<project>/<env>/<account>.json` and reuses it for 30 minutes (`QA_AUTH_MAX_AGE_MIN`). MHA allows one session per account: the role fixture re-logs in when the session was ended. Script the login only when the case tests the login itself. A project without a session option: copy `projects/scg-store/tests/fixtures/pages.fixture.ts` + `shared/auth/session.ts`.
5. **Spec** (`tests/e2e/<feature>/<name>.spec.ts`):
   ```ts
   import { test, expect } from '../../fixtures/pages.fixture';

   // Test case: projects/<slug>/cases/<feature>/<ID>-*.md
   test('<ID>: <case title in lower case> @regression', async ({ homePage, resultsPage }) => {
     await test.step('1. Search for a partial name', async () => {
       await homePage.goto();
       await homePage.search('plug');
     });
     await test.step('Results list matching products', async () => {
       await expect(resultsPage.productNames.first()).toContainText(/plug/i);
     });
   });
   ```
   | Case part | Code |
   |---|---|
   | Steps | page object methods, grouped in `test.step('N. ...')` |
   | Expected bullets | at least one web-first `expect` each (auto-retrying), in a `test.step` so it shows as a check in the run report |
   | Preconditions, shared setup | fixtures or page object helpers |
   | Test data | found at runtime (first row with the needed status, first non-approved item, options read from the page, IDs from result messages) in a page object method or fixture (e.g. mha-spf `faveTarget`); `test.skip()` with a clear message when nothing fits; fixed values in `tests/utils/test-data.ts` only with a "why" comment; secrets only via `requireEnv()` from `.env` |
   | Selectors, waits, quirks | page objects only, never the spec |
   - Title starts with the case ID and a colon; tags at the end (`@smoke`, `@regression`, `@writes`, `@final`).
   - Specs read like the case: page object calls and `expect` only. Clean up what the test changes, before and after, so it can run again.
6. **Enforced by `.\qa lint`:** no `page.locator()` in specs, no `waitForTimeout`, no `.only`, page objects from fixtures, imports exist, no imports from another project (share through `shared/` as `@shared/...`).
7. **Type check, then run only the new or updated tests** (2 green runs in a row; the whole suite only when the user asks):
   ```powershell
   .\qa typecheck                                    # must print nothing
   .\qa test --project=<slug> --grep "<ID>:"         # debug: --headed, --debug; trace: .\qa trace <zip>
   ```
8. Set `automated: true` in the case, bump `updated:`, add the spec path to its Notes, `.\qa lint`, and report with the run report path (`projects/<slug>/runs/<run>/report.html`).

Then finish the task: conventions > Finish (check, commit, push, hash in the report).
