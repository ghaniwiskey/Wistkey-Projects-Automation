---
id: BUG-024
title: "Create form does not check WhatsApp template rules (button length, body length, duplicates, variable placement, examples)"
severity: major
status: verified
env: local
url: "http://localhost:3000/templates"
updated: 2026-10-29T09:31:29.887Z
found: 2026-10-28T08:06:32.680Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-066]
frequency: always
---
## Summary
The New template form does not check WhatsApp template rules, so staff only find out later from a raw English Twilio error or a Meta rejection. Related: BUG-006 (name rule).

## Steps to reproduce
1. Open 新建模板 (New template) with Meta unticked and try each of these (from TWW-066): a button title of 25 characters; a body of 1100 characters; the name of an existing template; a body with "{{}}"; two buttons both titled Yes; two buttons with the same ID; a button with an empty ID; a body that starts or ends with a variable; a variable without an example value while Meta is ticked.
2. Delete anything that gets created.

## Expected
Each one is refused in the form with a clear Traditional Chinese message (button title at most 20 characters, body at most 1024 characters, unique name, no empty variable, unique button titles and IDs, no variable at the start or end, example value required).

## Actual
- Accepted with no error: 25-character button, 1100-character body, duplicate name, empty example value.
- Variable at the start or end: accepted, then rejected by Meta.
- "{{}}", empty button ID, duplicate button titles or IDs: raw English Twilio errors.

## Evidence
- Screenshot: ![34-template-validation.png](../explorations/2026-10-28-core-journeys/34-template-validation.png)

## Environment
- Base URL: http://localhost:3000/templates
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
- 2026-10-28: steps made reproducible on any local setup (placeholders <P>, <template id>, <n> and test data described row by row instead of our template IDs, phone and data files); Summary shortened to 1-2 sentences; our observed values kept under Actual ("Our run").
- 2026-10-29: status open -> verified; Retest passed in runs/2026-10-29_1630_local_manual (dev fix commit af9a789)..
