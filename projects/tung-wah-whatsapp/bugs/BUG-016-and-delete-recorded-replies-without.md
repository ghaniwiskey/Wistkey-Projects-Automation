---
id: BUG-016
title: "Reset and Reset all delete recorded replies without warning"
severity: major
status: open
env: local
url: "http://localhost:3000/templates/cmvongu2t0005kjy3stn25txd/contacts"
updated: 2026-10-28T07:16:23.041Z
found: 2026-10-28T07:16:23.041Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-055]
frequency: always
---
## Summary
Resetting contacts to pending also deletes their recorded replies. Resetting one contact has no confirmation; Reset all asks for confirmation but does not say replies will be deleted. This can erase a campaign's answers.

## UI labels in English
- 聯繫人: Contacts
- 全部重置: Reset all
- 重置: Reset
- 重置成功！: Reset successful!

## Steps to reproduce
1. Have a contact with a recorded reply (1 回覆)
2. Open 聯繫人, click 全部重置 and accept

## Expected
The confirmation states that replies will be deleted (or replies are kept).

## Actual
alert "重置成功！"; all contacts PENDING; responses count 0.

## Evidence
- Screenshot: ![26-reset-all-deletes-replies.png](../explorations/2026-10-28-core-journeys/26-reset-all-deletes-replies.png)

## Environment
- Base URL: http://localhost:3000/templates/cmvongu2t0005kjy3stn25txd/contacts
- Env: local

## History
- 2026-10-28: Clarified the report in English and replaced personal details in the report text with placeholders; no retest or status change.
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
