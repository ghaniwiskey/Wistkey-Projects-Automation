# Test case style (tester-facing)

How to write cases so a person outside this repo can run them. The user asked for this on 2026-10-30. It applies to new cases only; existing cases stay as they are.

## Wording

- Plain language. Write for a tester who has never seen this repo, Test Manager, `.env` or our questions and bugs.
- Accounts in plain words: "Log in to Viz One Studio with your Vizone account". No `.env` variable names, no passwords, no "ask the QA lead".
- Do not name the environment (staging, UAT, prod) in the case text: the same case may run anywhere.
- No internal references in tester-facing parts: no Q-/BUG- IDs, other case IDs, "Test Manager", "approval needed", "automated load script", "found at runtime".
- No results or data from our own runs: no "on 2026-10-30 it returned 22", no counts or durations from one environment. If a check depends on a count, write "note the count before the change and compare".
- Concrete examples are welcome with "e.g." (keywords, item types, 1-2 hour items).

## Sections

- **Test description = a scenario**: a short name on the first line, a blank line, then one "Verify that ..." sentence. Keep every fact: what, where (web app or desktop plugin), numbers, time limits.
  > Play a 1-2 hour item in Viz One Studio
  >
  > Verify that an editor can open and play a long program item (1 hour or longer) in the Viz One Studio player, and that the player does not hang or freeze.
- **Preconditions** come before the steps: only what must already exist or be set up (an account, a workstation with the plugin, an item of 1 hour or longer).
- **Test steps**: numbered user actions with concrete data. Step 1 is the login in plain words.
- **Expected result**: bullets, each one observable with exact numbers (within 5 seconds, 44 results, sound on every clip). If the target is not agreed yet, use a sensible number instead of a question reference, or "note the time taken".
- **Remarks**: only practical tips for the tester ("Repeat 5 times: the audio loss is random", "Record the times for both runs in Actual result"). Leave it empty when there is nothing useful.
- Internal links the repo needs (Q-/BUG- IDs, source notes) go only in the case's `## Notes`, never in Goal, Preconditions, Data, Steps or Expected.

## Scope

- Cover the source the user gave (feedback report, ticket, feature). Do not add generic edge cases (letter case, long input, script text, login errors) unless they test that source or the user asks.
- For a list of reported problems, write: one case per symptom, cases that verify each recommended fix, and post-fix regression cases (what the fix could break).
- Before adding more cases, check existing ones for overlap and merge or split instead of duplicating.

## Spreadsheet test plans

- Copy the user's template tab, keep its look, and fill it. Column order: Test Case ID, Module, Test Description, Feedback/Source Ref, Preconditions, Test Steps, Expected Result, Actual Result, Testing Date, Execution Status, Remarks (last). No Automation Status, Priority, Platform, Test Data or When-to-run columns unless asked.
- Fresh plan: Actual Result and Testing Date empty, Execution Status "Not Executed" for every case.
- Group rows by module: web app modules first, desktop plugin (manual workstation) cases last; IDs ascending inside a module.
- Status dropdowns as a fixed list (PASSED, FAILED, Blocked, Not Executed), not a range in another tab, so copying the sheet does not break them.
- The user edits the sheet too: read the current sheet before every change, write only the cells you change, and never write back rows, columns or text the user removed.
