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
Sending is allowed while {{first_name}} has no mapping; Twilio fills in the template's sample value, so the member gets someone else's name.

## Steps to reproduce
1. Open approved template attendance_confirmation with no saved variable mapping
2. Upload contacts-valid-hk.xlsx (QA Tester, 85265248661)
3. Click 發送到 WhatsApp and confirm
4. Open the message in Twilio > Monitor > Logs > Messaging

## Expected
The send is blocked with a message that {{first_name}} has no mapping (or the user must confirm a fallback).

## Actual
Alert "發送任務已啟動！"; Twilio delivered "Hi David, do you confirm your attendance?" to +85265248661 (contact name is QA Tester).

## Evidence
- Screenshot: ![06-twilio-unmapped-variable-sent-as-David.jpg](../explorations/2026-10-28-core-journeys/06-twilio-unmapped-variable-sent-as-David.jpg)

## Environment
- Base URL: http://localhost:3000/templates/cmvongu2t0005kjy3stn25txd
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
