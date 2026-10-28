---
name: "qa-explore"
description: "Run a time-boxed exploratory testing session on a project in this Playwright workspace using Aside's browser: find bugs, UX problems, accessibility and console/network issues, and missing coverage; file bugs and turn findings into test cases. Use when the user asks to explore, bug-hunt, sanity check, poke at, review UX of, or find issues in an app, page, or feature."
---

# Exploratory session

Rules: `docs/conventions.md`. Ideas: `docs/exploratory-heuristics.md`. Templates: `docs/templates/explore-session.md`, `docs/templates/bug-report.md`. Commands: `.\qa help`.

Exploration happens in Aside's browser (REPL `openTab` / `snapshot` / locator actions). It is not a Playwright run and never edits specs or page objects. Findings become bugs, questions, test cases and knowledge.

1. **Charter and preflight (one turn).** Charter: "Explore <area> with <techniques or data> to discover <risks>". Default timebox: 20 to 30 minutes of browsing. Read `projects/<slug>/project.yaml` (env, `allowWrites`, accounts), the project's `README.md` and `context.md` (plus the `context/<area>.md` you explore), and the known issues so they are not re-reported: `.\qa bugs <slug>` (every status; wont-fix = accepted behavior) and `.\qa questions <slug> --open`.
2. **Log in** with the project's test account (usernames in project.yaml, secrets in `.env` or Aside Vault; never print passwords). Respect `allowWrites` and README > Testing permissions.
3. **Explore** with the heuristics: tour the main journeys first, then vary inputs, states, roles, navigation and data. Keep a running list of findings.
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
     It only sees errors after it is installed and only `fetch` (not XHR). For a full picture of a suspicious action, reproduce it in a throwaway spec with `page.on('console')` / `page.on('response')`, then delete the spec and its run (`.\qa call deleteRun <slug> <runId>`).
   - Accessibility: controls that `snapshot` shows without a name or role cannot be targeted by `getByRole` either; note them.
4. **Classify each finding:**
   - **bug**: reproduce it twice, check the bug list for duplicates, then file it (`createBug`, see qa-run-tests 4.4) with exact steps, expected vs actual, URL, the screenshot (`../explorations/<folder>/<file>.png`) and `foundBy: explorations/<file>.md`.
   - **question**: unclear intended behavior; `.\qa call createQuestion <slug> "@<tmp>\q.json"` (conventions > Questions) and ask the user.
   - **risk / test idea / coverage gap**: write it as a test case right away (qa-write-tests, after a duplicate check, linking related bugs and questions in its Notes); never leave it as an unchecked idea or only in chat (user rule).
5. **Session notes** `projects/<slug>/explorations/YYYY-MM-DD-<charter-slug>.md` from the template: scope, coverage, findings with links, cases written, knowledge updates, QA data left behind.
6. **Knowledge:** conventions > Knowledge files (facts by topic into README/context; no dated sections).
7. **Record the executed cases in the Test Manager (always, user rule):** one manual run per project with only the cases actually executed (leave partly covered ones out and say so):
   ```powershell
   .\qa call createManualRun <slug> env=<env> ids=ID-001,ID-002 name=exploratory-<date> tester=Aside     # -> runId
   .\qa call updateManualTest <slug> <runId> ID-001 status=pass "note=..."                              # expected='["pass","fail"]' per bullet when useful
   .\qa call updateManualTest <slug> <runId> ID-002 status=fail failureType=product-bug bug=BUG-0NN "note=..."
   .\qa evidence <slug> <runId> ID-002 <screenshot.png>                                               # every fail
   .\qa call finishManualRun <slug> <runId>
   ```
   Fails link their bug (`product-bug`) or stay `untriaged` when they wait on a question (add the case to the question's `tests:`). A bug without a case: create the case first and link it (`.\qa call updateBug <slug> BUG-0NN tests=ID-001,ID-003`; `tests=` replaces the list, so pass every linked ID). Then `.\qa lint`.
8. **Finish:** conventions > Finish (`Explore <area>: <n> bugs, <n> cases`).
9. **Report:** top findings with a screenshot, bugs filed, questions for the user, cases written (offer to automate them).
