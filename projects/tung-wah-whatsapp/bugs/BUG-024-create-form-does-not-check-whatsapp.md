---
id: BUG-024
title: "Create form does not check WhatsApp template rules (button length, body length, duplicates, variable placement, examples)"
severity: major
status: open
env: local
url: "http://localhost:3000/templates"
updated: 2026-10-28T08:06:32.680Z
found: 2026-10-28T08:06:32.680Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-066]
frequency: always
---
## Summary
Rules that Meta/Twilio enforce are not checked in the form, so staff get raw English Twilio errors or a Meta rejection later. Related: BUG-006 (name rule).

## Steps to reproduce
1. Try the inputs listed in TWW-066

## Expected
Clear Traditional Chinese validation in the form for each rule.

## Actual
See evidence: 25-char button, 1100-char body, duplicate name and empty example pass; variable at start/end rejected by Meta; {{}}, empty ID and duplicate titles/IDs return raw English Twilio errors.

## Evidence
- Screenshot: ![34-template-validation.png](../explorations/2026-10-28-core-journeys/34-template-validation.png)

## Environment
- Base URL: http://localhost:3000/templates
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
