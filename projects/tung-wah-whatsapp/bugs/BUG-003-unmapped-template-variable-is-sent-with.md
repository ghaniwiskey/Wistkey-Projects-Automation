---
id: BUG-003
title: "Unmapped template variable is sent with the Twilio sample value (\"Hi David\")"
severity: major
status: open
env: local
url: "http://localhost:3000/templates/cmvongu2t0005kjy3stn25txd"
updated: 2026-10-28T08:47:00.399Z
found: 2026-10-28T06:37:45.879Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-037]
frequency: always
---
## Summary
The app lets you send a template while its variable {{first_name}} is not linked ("mapped") to a column of the contact list. Twilio then fills in the template's sample value, "David", so the member receives someone else's name.

## Steps to reproduce
1. Open the approved template attendance_confirmation, which has no saved variable mapping.
2. Upload contacts-valid-hk.xlsx (one contact: QA Tester, 85265248661).
3. Click 發送到 WhatsApp (Send to WhatsApp) and confirm.
4. Open the message in Twilio > Monitor > Logs > Messaging.

## Expected
Sending is blocked with a message saying {{first_name}} has no mapping (or the user must first confirm a fallback value).

## Actual
The alert "發送任務已啟動！" ("Send job started!") appears. Twilio delivered "Hi David, do you confirm your attendance?" to +85265248661, although the contact's name is QA Tester.

## Evidence
- Screenshot: ![06-twilio-unmapped-variable-sent-as-David.jpg](../explorations/2026-10-28-core-journeys/06-twilio-unmapped-variable-sent-as-David.jpg)

## Environment
- Base URL: http://localhost:3000/templates/cmvongu2t0005kjy3stn25txd
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
