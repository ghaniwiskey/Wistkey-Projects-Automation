---
id: BUG-024
title: "Create form does not check WhatsApp template rules (button length, body length, duplicates, variable placement, examples)"
severity: major
status: open
env: local
url: "http://localhost:3000/templates"
updated: 2026-10-28T08:47:00.399Z
found: 2026-10-28T08:06:32.680Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-066]
frequency: always
---
## Summary
The new template form does not check rules that Meta and Twilio enforce. Staff only find out later, from a raw English Twilio error or from a Meta rejection. Related: BUG-006 (name rule).

## Steps to reproduce
1. Open 新建模板 (New template) with Meta unticked and try each input listed in TWW-066: a button title of 25 characters; a body of 1100 characters; the name of an existing template; a body with "{{}}"; two buttons both titled Yes; two buttons with the same ID; a button with an empty ID; a body starting or ending with a variable; a variable without an example value while Meta is ticked.

## Expected
Each rule is checked in the form with a clear Traditional Chinese message (rules from TWW-066: button title at most 20 characters, body at most 1024 characters, unique name, no empty variable, unique button titles and IDs, no variable at the start or end, example value required).

## Actual
- Accepted with no error: 25-character button, 1100-character body, duplicate name, empty example value.
- Variable at the start or end of the body: rejected later by Meta.
- "{{}}", empty button ID, and duplicate button titles or IDs: rejected with raw English Twilio errors.

## Evidence
- Screenshot: ![34-template-validation.png](../explorations/2026-10-28-core-journeys/34-template-validation.png)

## Environment
- Base URL: http://localhost:3000/templates
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
