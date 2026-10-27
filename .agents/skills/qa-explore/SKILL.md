---
name: "qa-explore"
description: "Run a time-boxed exploratory testing session on a project in this Playwright workspace using Aside's browser: find bugs, UX problems, accessibility and console/network issues, and missing coverage; file bugs and turn findings into test cases. Use when the user asks to explore, bug-hunt, sanity check, poke at, review UX of, or find issues in an app, page, or feature."
---

# Exploratory session

Rules: `docs/conventions.md`. Ideas: `docs/exploratory-heuristics.md`. Session notes: `docs/templates/explore-session.md`. Bugs: `docs/templates/bug-report.md`.

Exploration happens in Aside's browser (REPL `openTab` / `snapshot` / locator actions). It is not a Playwright run: nothing goes into `runs/`, and it never edits specs or page objects. Findings become bugs, test case ideas, and knowledge notes.

1. **Charter and preflight (one turn).** Charter: "Explore <area> with <techniques or data> to discover <risks>". Default timebox: 20 to 30 minutes of browsing. Read `projects/<slug>/project.yaml` (env, `allowWrites`, test accounts), the project's `README.md` / `context.md` (and the relevant part of any user manual in `docs/`), and open bugs (`bugs/`), so known issues are not re-reported.
2. **Log in** with the project's test account (usernames in project.yaml, secrets in `.env` or Aside Vault; never print passwords). Respect `allowWrites` and the project's safety notes: no real payments, no emails to real people, no deleting shared data.
3. **Explore** with the heuristics: tour the main journeys first, then vary inputs, states, roles, navigation and data. Keep a running list of findings as you go.
   - Evidence the moment something looks wrong: `await page.screenshot({ path: '<projects/slug/explorations/YYYY-MM-DD-charter>/NN-short-name.png' })`.
   - JS errors and failed API calls (the UI often swallows them, like SCG's silent 400 on add-to-cart): install a collector after each full page load and read it before leaving the page:
     ```js
     await page.evaluate(() => {
       if (window.__qaErrs) return; window.__qaErrs = [];
       addEventListener('error', (e) => __qaErrs.push('js: ' + e.message));
       addEventListener('unhandledrejection', (e) => __qaErrs.push('promise: ' + String(e.reason)));
       const f = window.fetch; window.fetch = async (...a) => { const r = await f(...a); if (r.status >= 400) __qaErrs.push(`fetch ${r.status} ${r.url}`); return r; };
     });
     // ... interact ...
     console.log(await page.evaluate(() => window.__qaErrs));
     ```
     It only sees errors after it is installed and only `fetch` calls (not XHR). For a full picture of a suspicious action, reproduce it in a throwaway Playwright spec with `page.on('console')` / `page.on('response')` then delete the spec and its run folder (`s.deleteRun('<slug>', '<runId>')`) so it does not count in reports.
   - Accessibility signal: controls that `snapshot` shows without a name or role are the ones `getByRole` cannot target either; note them.
4. **Classify each finding:**
   - **bug**: reproduce it twice, check open bugs for duplicates, then file it with the store (`createBug`, see the qa-run-tests skill) with exact steps, expected vs actual, URL and the screenshot path (`../explorations/<folder>/<file>.png`), `foundBy: explorations/<file>.md`.
   - **question**: unclear intended behavior; ask the user.
   - **risk**: fragile or unvalidated area worth covering.
   - **test idea**: a behavior that deserves a case (priority and tags suggested).
5. **Write the session notes** `projects/<slug>/explorations/YYYY-MM-DD-<charter-slug>.md` from the template: scope, coverage notes, findings table with bug links, new test ideas, knowledge updates.
6. **Write back knowledge:** new quirks, routes and waits into the project's `README.md` / `context.md`; selectors that page objects will need can be listed in the notes for when the case is automated.
7. **Record results in the Test Manager (always, user rule).** For every case executed during the session, record a manual run per project with `test-manager/lib/store.mjs`: `createManualRun(slug, { env, ids, name: 'exploratory-<date>', tester })` -> `updateManualTest(slug, runId, id, { status, expected: [per-bullet pass/fail], note, failureType, bug })` -> `addManualEvidence` (screenshot data URL) for fails -> `finishManualRun`. Include only cases actually executed; leave partially covered ones out and say so. Fails link their bug (`product-bug`) or stay `untriaged` when it is an open question. If a bug has no case yet, create the case first (qa-write-tests) and link it via `updateBug(..., { tests })`. Run `test-manager/cli.mjs lint`.8. **Commit and push** the session notes, screenshots, bugs and knowledge updates: `git add -A`, `git commit -m "Explore <area>: <n> bugs, <n> test ideas"`, `git push`.
9. **Report:** top findings with a screenshot, bugs filed, questions for the user. Offer to turn test ideas into cases (qa-write-tests) and to automate them.
