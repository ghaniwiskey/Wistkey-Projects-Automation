---
id: BUG-003
title: "Unmapped template variable is sent with the Twilio sample value (\"Hi David\")"
severity: major
status: verified
env: local
url: "http://localhost:3000/templates/<template id>"
updated: 2026-10-29T09:31:27.921Z
found: 2026-10-28T06:37:45.879Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-037]
frequency: always
---
## Summary
A template can be sent while a variable has no column mapped. Twilio then fills in the template's sample value, so members get someone else's name (e.g. "Hi David").

## Steps to reproduce
1. Open an APPROVED template whose body has {{first_name}} and that has no saved variable mapping.
2. Upload an Excel file with one contact: your name and 852<P>.
3. Click 發送到 WhatsApp (Send to WhatsApp) and confirm.
4. Check the message on your phone, or in Twilio Console > Monitor > Logs > Messaging.

## Expected
Sending is blocked with a message that {{first_name}} has no mapping (or the user must confirm a fallback value first).

## Actual
"發送任務已啟動！" ("Send job started!") appears. The message arrives with the template's sample value instead of the contact's name.

Our run: template attendance_confirmation (sample value "David"), contact QA Tester, 85265248661 (data/contacts-valid-hk.xlsx). Twilio delivered "Hi David, do you confirm your attendance?" to +85265248661.

## Evidence
- Screenshot: ![06-twilio-unmapped-variable-sent-as-David.jpg](../explorations/2026-10-28-core-journeys/06-twilio-unmapped-variable-sent-as-David.jpg)

## Environment
- Base URL: http://localhost:3000/templates/<template id>
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
- 2026-10-28: steps made reproducible on any local setup (placeholders <P>, <template id>, <n> and test data described row by row instead of our template IDs, phone and data files); Summary shortened to 1-2 sentences; our observed values kept under Actual ("Our run").
- 2026-10-29: status open -> verified; Retest passed in runs/2026-10-29_1630_local_manual (dev fix commit af9a789)..
