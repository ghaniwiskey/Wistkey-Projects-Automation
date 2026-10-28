---
id: BUG-011
title: "Reset contact still shows the previous send time (發送時間)"
severity: trivial
status: open
env: local
url: "http://localhost:3000/templates/<template id>/contacts"
updated: 2026-10-28T09:08:46.326Z
found: 2026-10-28T06:39:16.500Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-034]
frequency: always
---
## Summary
After a sent contact is reset to pending, it still shows the old send time, which makes it look sent.

## Steps to reproduce
1. On an APPROVED template, send to a contact (your number 852<P>) so it shows 已發送 (Sent).
2. Open 聯繫人 (Contacts) and click 重置 (Reset) on that contact.

## Expected
The send time is removed, or labelled as the previous send.

## Actual
The contact shows 待發送 (Pending) together with 發送時間：<date, time> ("Send time: ...").

Our run (attendance_confirmation): 待發送 85265248661 發送時間：10/28/2026, 1:20:29 PM.

## Evidence
- Screenshot: ![reset](../explorations/2026-10-28-core-journeys/17-alerts-buttons-overwrite.png)

## Environment
- Base URL: http://localhost:3000/templates/<template id>/contacts
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
- 2026-10-28: steps made reproducible on any local setup (placeholders <P>, <template id>, <n> and test data described row by row instead of our template IDs, phone and data files); Summary shortened to 1-2 sentences; our observed values kept under Actual ("Our run").
