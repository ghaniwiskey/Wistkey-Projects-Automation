---
name: "qa-run-tests"
description: "Run the Playwright POM test suites of projects in this workspace (by project, suite tag, test IDs, priority, or test plan), triage failures (product-bug, test-issue, environment), fix stale page objects, file or link bugs, retest bug fixes, and report. Use when the user asks to run, re-run, smoke test, regression test, retest a bug, triage a failed run, or verify a deploy."
---

# Run tests and triage

Rules: `docs/conventions.md` (statuses, failure types, bugs, Safety). Every run is plain Playwright with the root config and is recorded in `projects/<slug>/runs/<stamp>_<env>_playwright/`. Commands: `.\qa help`.

## 1. Scope and preflight

- Project `--project=<slug>` (all projects: omit it). Env = `defaultEnv` in project.yaml unless the user names one (`$env:QA_ENV='staging'`; clear it after: `Remove-Item Env:QA_ENV`).
  | Ask | Selection |
  |---|---|
  | smoke / regression | `--grep '@smoke'` (quote it: a bare `@smoke` is PowerShell splatting) |
  | specific tests | `--grep "SCG-001:\|SCG-004:"` |
  | priority (P0, ...) | IDs from `.\qa tests <slug> --auto --priority P0`, then grep them |
  | a test plan | `$env:QA_PLAN='PLAN-001'` + the plan's scope (`.\qa call getPlan <slug> PLAN-001`) |
  | a bug retest | the bug's `tests:` (`.\qa bugs <slug>` lists them) |
- Name the run's suite with `$env:QA_SUITE='smoke'` (default `playwright`).
- Envs with `allowWrites: false` skip `@writes` tests automatically; do not override that.
- Safety preflight (conventions > Safety): exclude `@final` and other irreversible scenarios unless approved for this run (`--grep-invert '@final'`), and read the project's README > Testing permissions (what may be written, rate and session limits).
- Manual-only cases (`automated: false`) cannot run here: list them as not run; offer to automate them (qa-write-tests Part B) or to step through them in the Test Manager's Manual run.

## 2. Run (no AI work unless something is broken)

```powershell
.\qa auto --project=<slug> --grep '@smoke'     # test:auto: one retry, then it sorts the results itself
```
- Exit 0 (all passed, flaky allowed) or 2 (only environment problems, already triaged as `environment`): **stop here.** Report the summary block in 2 to 4 lines (counts, flaky IDs, environment reason, run report path); do not investigate, browse or reread files. Exit 2: tell the user to rerun once the site is reachable.
- Exit 1 (broken tests): it wrote `reports/heal/<stamp>.json`. Continue with Heal mode for exactly those tests.
- Exit 3: Playwright recorded nothing; read its output (config or TypeScript error, no matching tests) and fix or report.
- Long suites: start with `yield_ms` and poll. The reporter prints `[qa] <slug> (...): N pass, N fail ... -> projects/<slug>/runs/<runId>/report.md`.

## Heal mode ("Heal the broken tests in reports/heal/<stamp>.json")

1. Read the request (newest `status: "pending"` file in `reports/heal/` if no path was given). It lists `runs` and the broken `tests` (slug, runId, id, file, first error line). Environment failures and flaky tests in it are for information only.
2. Triage each broken test (section 4): reproduce, decide, fix test-issues in page objects, file or link bugs, record the triage on the original run.
3. Verify with `.\qa auto --project=<slug> --grep "<ID1>:|<ID2>:"` until it exits 0 (or the rest are triaged product bugs).
4. Update the request file: `status` (`healed`, `bugs-filed`, `partly-healed` or `blocked`), `finishedAt`, and per test `outcome` + one-line `note`. Then finish (section 7) and report. Never commit `.only`.

## 3. Read the results

- `.\qa failures <slug> [runId]`: each fail/flaky/blocked result with its error lines, failed checks, evidence paths and `error-context` (Playwright's accessibility snapshot of the page at the failure, overwritten by the next run; often the fastest way to see what the page showed). Open `results.json` only when you need more.
- Look at the failure screenshot before deciding anything.

## 4. Triage every failure

1. **Rerun the failed test once** (`--grep "<ID>:"`). Passes now: report it as flaky and look for the cause (missing wait in a page object, shared data); do not hide it.
2. **Reproduce by hand** in Aside's browser (`openTab(baseUrl)`, the case's steps, `snapshot`), or read the error and screenshot when the cause is obvious. Decide per conventions > Failure types. A test-issue is fixed in the **page object** (selectors, waits, quirk handling), not with locators or waits in the spec; when the expected behavior really changed, update the case too (bump `updated:`; ask when unsure whether the change is intended). Environment: stop rerunning against a blocking WAF and tell the user.
3. **Record the triage** on the run (same as the Test Manager's buttons; re-renders the reports):
   ```powershell
   .\qa call triageRunTest <slug> <runId> <ID> failureType=product-bug bug=BUG-002 "note=Badge stays at 0; API 200"
   ```
4. **Product bug:** look for the same symptom first (`.\qa bugs <slug> --open`, then `.\qa call getBug <slug> <id>` for the likely ones) and link it instead of filing a duplicate. Otherwise write the bug JSON to the session temp folder and `.\qa call createBug <slug> "@<tmp>\bug.json"` (format: conventions > Bugs):
   ```json
   { "title": "Cart badge does not update after adding a product from search", "severity": "major", "env": "staging",
     "url": "https://...", "foundBy": "runs/<runId>", "tests": ["SCG-001"], "frequency": "always", "summary": "...",
     "steps": ["Log in as the test account", "Search for ...", "Click Add to Cart"], "expected": "...", "actual": "... (exact text)",
     "evidence": ["Screenshot: ![failure](../runs/<runId>/screenshots/<file>.png)", "Failed request: POST /api/cart 400 Not enough quantity"] }
   ```
   Then triage the result with the new bug ID.
5. **After fixing a test-issue,** rerun the test until it passes twice. The new run supersedes the old one in the reports.

## 5. Bug retests

Rerun the bug's `tests:`. All pass: `.\qa call updateBug <slug> BUG-002 status=verified "note=Retest passed in runs/<runId>"`. Still failing: `status=open "note=Still fails in runs/<runId>"`. Only the user or a developer sets `fixed`. Then follow conventions > Bugs for the linked cases and specs.

## 6. Report

- Verdict and counts (pass / fail / flaky / skipped), each failure with its failure type and bug, manual-only cases not run, page object fixes made.
- Copy `projects/<slug>/runs/<runId>/report.html` into the session artifacts folder (e.g. `<runId>-report.html`) and mention it; show the most important failure screenshot.
- Write back what you learned: conventions > Knowledge files.
- Several projects: one command without `--project`, or one subagent per project; summarize per project.

## 7. Finish

conventions > Finish. A run with no other edits is not pushed on its own; its folder goes out with the next significant commit.
