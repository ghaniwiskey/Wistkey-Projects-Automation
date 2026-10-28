---
id: BUG-011
title: "Reset contact still shows the previous send time (發送時間)"
severity: trivial
status: open
env: local
url: "http://localhost:3000/templates/cmvongu2t0005kjy3stn25txd/contacts"
updated: 2026-10-28T08:47:00.399Z
found: 2026-10-28T06:39:16.500Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-034]
frequency: always
---
## Summary
After you click 重置 (Reset) on a contact that was already sent, its status changes to 待發送 (Pending), but it still shows "發送時間：10/28/2026, 1:20:29 PM" ("Send time: 10/28/2026, 1:20:29 PM"). This makes it look like the message was sent.

## Steps to reproduce
1. Open 聯繫人 (Contacts) of attendance_confirmation, with a contact whose status is 已發送 (Sent).
2. Click 重置 (Reset).

## Expected
The send time is removed, or labelled as the previous send.

## Actual
The contact shows: 待發送 85265248661 發送時間：10/28/2026, 1:20:29 PM (Pending, 85265248661, Send time: 10/28/2026, 1:20:29 PM).

## Evidence
- Screenshot: ![reset](../explorations/2026-10-28-core-journeys/17-alerts-buttons-overwrite.png)

## Environment
- Base URL: http://localhost:3000/templates/cmvongu2t0005kjy3stn25txd/contacts
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
