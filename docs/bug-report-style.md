# Bug report style (reader-facing)

Apply the tester-facing style of [test-case-style.md](test-case-style.md) to new bug reports. Do not rewrite existing reports just to apply this style.

## Wording and scope

- Write for someone who has not seen this repo or Test Manager. Plain language, short sentences, no repeated title and summary.
- Name accounts by role ("your editor account"), not `.env` variables, passwords or "ask the QA lead". Describe how to find suitable data instead of saying "found at runtime".
- Keep internal Q-/BUG-/case IDs, run paths and workflow instructions out of the reader-facing explanation. Preserve required links in repository metadata, Evidence and History; a spreadsheet may link its own test case IDs when useful to the reader.
- Never invent a cause, timing threshold, severity or expected behavior. Distinguish observed facts from a suspected cause. If intended behavior is unknown, record a question rather than claiming a confirmed defect.
- One report per distinct defect; search for duplicates first. Stay within the requested feedback/feature scope unless asked otherwise.

## Sections

- **Title / issue description:** short, searchable statement of what fails and where. Example: "Premiere export loses audio from Vizone clips".
- **Summary:** explain the trigger and user impact in one or two sentences, without repeating the title. Include the affected app or module and important conditions (long files, archived clips, peak hours).
- **Preconditions / starting state:** what must already exist, before the steps: account role, relevant file or item, workstation/plugin version, configuration. Add a separate Preconditions section when needed, or state these before the actions in Steps to reproduce.
- **Steps to reproduce:** numbered user actions, plain-language login when needed, concrete inputs and exact navigation. Include necessary repetitions for intermittent defects. No selectors, automation instructions or internal approval notes.
- **Expected:** specific observable behavior supported by the requirement, ticket or feedback. Do not substitute "works correctly" or an arbitrary number.
- **Actual:** the observed behavior, exact error message, measured time, count, affected audio tracks or file details where relevant. State frequency honestly (e.g. "2 of 5 exports", not "always" after one attempt).
- **Evidence:** screenshot or recording of the failure; relevant console/network details only. Remove credentials and private data. A person outside this repo must have an accessible attachment/link, not only a local run path.
- **Remarks:** practical reproduction tips or workarounds only; leave empty if none. Example: "Mute track A2 before export to restore sound". No internal questions or references the recipient cannot access.

## Facts and sharing

Bug reports are evidence of a specific observation, unlike reusable test cases. Keep the actual URL/environment, date, version, exact record identifier and measured values in repository metadata/Environment/Evidence when needed to reproduce; do not remove them merely to make the wording generic. In reader-facing descriptions or a shared sheet, omit environment labels unless requested or necessary to distinguish the failure. Never falsify or reset observed results.

Reports taken only from user feedback must say "Reported by users; not reproduced yet". Do not present them as personally confirmed. Recommended fixes are suggestions, not proof of the cause or implementation.

## Spreadsheet defect reports

Follow `.agents/skills/qa-sheet-plan/SKILL.md` for safe editing. Preserve the user's current layout and omissions. Where columns can be chosen, use: Defect ID, Module, Issue Description, Preconditions, Steps to Reproduce, Expected Result, Actual Result, Date Detected, Date Fixed, Date Deployed, Status, Severity, Attachment, Remarks (last). Add only columns that help the recipient.

Keep defect status and severity dropdowns as fixed lists, with the workspace/template's allowed values. Verify counts, charts, dropdowns and colour rules after edits. Do not automatically apply the fresh-test-plan reset to defect reports: confirmed failures and their history remain factual evidence.
