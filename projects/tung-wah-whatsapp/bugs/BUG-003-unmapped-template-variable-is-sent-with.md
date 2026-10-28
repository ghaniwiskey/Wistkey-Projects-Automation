---
id: BUG-003
title: "Unmapped template variable is sent with the Twilio sample value (\"Hi David\")"
severity: major
status: open
env: local
url: "http://localhost:3000/templates/cmvongu2t0005kjy3stn25txd"
updated: 2026-10-28T06:37:45.879Z
found: 2026-10-28T06:37:45.879Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-037]
frequency: always
---
## Summary
The app lets a message be sent without mapping {{first_name}} to a contact field. Twilio then uses the sample value, so the recipient sees the wrong name.

## UI labels in English
- 發送到 WhatsApp: Send to WhatsApp

## Steps to reproduce
1. Open approved template attendance_confirmation with no saved variable mapping
2. Upload contacts-valid-hk.xlsx (QA Tester, <QA phone>)
3. Click 發送到 WhatsApp and confirm
4. Open the message in Twilio > Monitor > Logs > Messaging

## Expected
The send is blocked with a message that {{first_name}} has no mapping (or the user must confirm a fallback).

## Actual
Alert "發送任務已啟動！"; Twilio delivered "Hi David, do you confirm your attendance?" to <QA phone> (contact name is QA Tester).

## Evidence
- Screenshot: ![06-twilio-unmapped-variable-sent-as-David.jpg](../explorations/2026-10-28-core-journeys/06-twilio-unmapped-variable-sent-as-David.jpg)

## Environment
- Base URL: http://localhost:3000/templates/cmvongu2t0005kjy3stn25txd
- Env: local

## History
- 2026-10-28: Clarified the report in English and replaced personal details in the report text with placeholders; no retest or status change.
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
