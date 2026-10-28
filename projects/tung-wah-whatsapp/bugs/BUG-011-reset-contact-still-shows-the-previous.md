---
id: BUG-011
title: "Reset contact still shows the previous send time (發送時間)"
severity: trivial
status: open
env: local
url: "http://localhost:3000/templates/cmvongu2t0005kjy3stn25txd/contacts"
updated: 2026-10-28T06:39:16.500Z
found: 2026-10-28T06:39:16.500Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-034]
frequency: always
---
## Summary
After a sent contact is reset, its status changes to pending, but the old send time remains visible. This can make the contact look as if it has already been sent.

## UI labels in English
- 聯繫人: Contacts
- 重置: Reset
- 待發送: Pending
- 已發送: Sent

## Steps to reproduce
1. Open 聯繫人 of attendance_confirmation with a 已發送 contact
2. Click 重置

## Expected
Send time cleared or labelled as the previous send.

## Actual
待發送 <QA phone> 發送時間：10/28/2026, 1:20:29 PM

## Evidence
- Screenshot: ![reset](../explorations/2026-10-28-core-journeys/17-alerts-buttons-overwrite.png)

## Environment
- Base URL: http://localhost:3000/templates/cmvongu2t0005kjy3stn25txd/contacts
- Env: local

## History
- 2026-10-28: Clarified the report in English and replaced personal details in the report text with placeholders; no retest or status change.
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
