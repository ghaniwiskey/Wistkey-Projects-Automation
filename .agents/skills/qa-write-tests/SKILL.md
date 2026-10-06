---
name: "qa-write-tests"
description: "Design and write test cases (Markdown in projects/<slug>/cases) for a project in this Playwright workspace from a feature description, user story, ticket, user manual, bug report, or the live app, and optionally automate them as Page Object Model Playwright tests. Use when the user asks to create, add, generate, review, or improve test cases or coverage, or to automate a test case."
---

# Write test cases (and automate them with POM)

Rules: `docs/conventions.md`. Case format: `docs/templates/test-case.md`. Ideas for gaps: `docs/exploratory-heuristics.md`. Code style: `.agents/skills/playwright-e2e`, where this workspace's rules win over its generic examples (see Part B).

Node: `npx` fails in this shell. Use `$node = 'C:\Users\USER\.aside\runtime\node\node.exe'` and run from the workspace root.

## Part A: design and write the cases

1. **Gather the source of truth.** Requirement text, ticket links (open them), the project's docs (`projects/<slug>/README.md`, `context.md`, `docs/` such as the mha-spf user manual: read only the relevant section), or the live app in Aside's browser (`openTab` + `snapshot(page, { interactive: true })`). Check what exists so you do not write duplicates:
   ```powershell
   & $node --input-type=module -e "const s=await import('./test-manager/lib/store.mjs'); for (const t of s.listTests('<slug>')) console.log(t.id, t.priority, t.tags.join(','), t.automated?'auto':'manual', t.title)"
   ```
2. **Design before writing.** List candidate cases per behavior:
   - Happy paths first (P0/P1), then validation, boundaries, errors, permissions/roles, state and persistence (P1/P2), cosmetic (P3).
   - Use the heuristics checklist to find gaps. One behavior per case; merge near-duplicates; skip what existing cases cover.
   - Show the plan (title, priority, tags) and wait for approval when there are more than 10 cases or the requirements are ambiguous.
3. **Write each case through the Test Manager store** so the ID, file name and format are exactly what the app and lint expect:
   ```powershell
   & $node --input-type=module -e "const s=await import('./test-manager/lib/store.mjs'); console.log(JSON.stringify(s.createTest('<slug>', {
     title: 'Guest sees search results for a partial product name', feature: 'search', priority: 'P1', tags: ['regression'], envs: ['all'],
     goal: 'A guest can find products by typing part of the name.',
     preconditions: [], data: ['Query: plug'],
     steps: ['Open the home page', 'Search for plug'],
     expected: ['The results page lists at least one product whose name contains \"Plug\"'],
     notes: '' })))"
   ```
   It returns `{ id, file }` (next free ID, `cases/<feature>/<ID>-<slug>.md`, `automated: false`). For long cases, write a small `.mjs` file in the session temp folder instead of a one-liner. Editing an existing case: edit the Markdown directly and bump `updated:`.
   - Steps are user actions with concrete data; `<unique>` where values must differ per run. No selectors, waits or CSS in cases.
   - Every Expected bullet is observable: exact text, count, URL, state, value after reload.
   - Tags: `smoke` only for the few critical journeys, `regression` for the rest, plus `writes` whenever data is created, changed or deleted, or emails/orders are triggered.
4. **Validate:** `& $node test-manager/cli.mjs lint` must show 0 errors for the project.
5. **Report:** cases added (ID, title, priority, tags), coverage gaps noticed, open questions. Offer to automate them (Part B).

## Part B: automate a case (Page Object Model)

Only when the user asks, or for cases they approve. One case = one Playwright test.

1. **Read the project's suite first:** `tests/pages/*.page.ts` (reuse existing page objects and methods), `tests/fixtures/pages.fixture.ts`, `tests/utils/test-data.ts`, one existing spec as the style reference, and `shared/` (`@shared/pages/app.page.ts`, `@shared/utils/env.ts`).
2. **Find stable selectors** in the live app with Aside's browser (`snapshot`), in this order: `getByRole` > `getByLabel` > `getByPlaceholder` > `getByText` > `getByTestId` > CSS (last resort, with a comment saying why).
3. **Page objects** (`tests/pages/<page>.page.ts`): locators as readonly fields, user-level action methods (`addToCart()`, `filterByStatus(status)`), and `expect...()` helpers for page-level checks. Waits for the app's own quirks (hydration, spinners, modals) belong here. Extend the project's own base page (`tests/pages/base.page.ts`); a project without one starts from `AppPage` in `@shared/pages/app.page`.
4. **Fixture:** register any new page object in `tests/fixtures/pages.fixture.ts`.
   - **Login:** if the case only needs a logged-in user, do not script the login: use the project's session option at the top of the spec or describe block, `test.use({ role: '<role-slug>' })` (mha-spf, starts on the dashboard with that role active) or `test.use({ loggedIn: true })` (scg-store). It logs in once and reuses the session (README > Login sessions). Script the login through the login page object only when the case tests the login itself. A project without a session option yet: add one following `projects/scg-store/tests/fixtures/pages.fixture.ts` and `shared/auth/session.ts`.
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
   - Title starts with the case ID and a colon; tags at the end (`@smoke` / `@regression` / `@writes`).
   - Each Expected bullet becomes at least one `expect`; wrap steps in `test.step(...)` so they show as checks in the run report.
   - Specs read like the case: page object calls and `expect` only.
   - Clean up anything the test changes (before and after), so it can run again.
   - **Avoid hard-coded data** (user rule): find it at runtime so the test survives data changes (status changes, approvals, a new year's records, other users' edits). Examples: the first row with the needed status, the first non-approved cost centre, dropdown options read from the page, the newest record, an ID taken from the result message. Put the lookup in a page object method or a fixture (e.g. mha-spf `faveTarget`), and `test.skip()` with a clear message when nothing suitable exists. Hard-code only when there is no other way, and add a comment saying why. Cases describe the rule ("the first NEW asset"), not a fixed ID.
6. **This workspace's rules (enforced by `tm:lint`):** page objects come from fixtures (do not `new` them in `beforeEach`), no `page.locator()` in specs, no `waitForTimeout`, no `.only`, no imports from another project (share through `shared/` as `@shared/...`), secrets only via `requireEnv()` from `.env`.
7. **Type check, then run it** (2 green runs in a row before calling it done). Run only the new or updated tests (grep their IDs); never the whole suite after automating, unless the user asks for it:
   ```powershell
   & $node node_modules/typescript/bin/tsc --noEmit -p tsconfig.json   # must print nothing
   & $node node_modules/playwright/cli.js test --project=<slug> --grep "<ID>:"
   ```
8. Set `automated: true` in the case, bump `updated:`, add the spec path to its Notes, run lint again, and report the result with the run report path (`projects/<slug>/runs/<run>/report.html`).

## Commit and push (always)

After cases are written (Part A) or a test is automated and green (Part B): `git add -A`, one commit per logical change (`Add SPF-002/003 cases for asset listing`, `Automate SPF-002 with AssetListingPage`), `git push`. Check `git status` first that no secrets are staged (`.env`, auth state). Never force-push. Mention the commit hash in the report.
