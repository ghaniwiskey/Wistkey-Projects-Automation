---
id: BUG-016
title: "重置 and 全部重置 delete recorded replies without warning"
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
Resetting contacts to 待發送 also deletes their replies. Single 重置 has no confirmation; 全部重置 asks only "確定要將所有聯繫人重置為待發送狀態嗎？" without mentioning replies. One click can wipe a whole campaign's answers.

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
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
