---
id: BUG-016
title: "重置 (Reset) and 全部重置 (Reset all) delete recorded replies without warning"
severity: major
status: open
env: local
url: "http://localhost:3000/templates/cmvongu2t0005kjy3stn25txd/contacts"
updated: 2026-10-28T08:47:00.399Z
found: 2026-10-28T07:16:23.041Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-055]
frequency: always
---
## Summary
Resetting contacts back to 待發送 (Pending) also deletes their replies.
- The single 重置 (Reset) button asks for no confirmation.
- 全部重置 (Reset all) only asks "確定要將所有聯繫人重置為待發送狀態嗎？" ("Are you sure you want to reset all contacts to pending?") and does not mention replies.

One click can wipe out all the answers of a whole campaign.

## Steps to reproduce
1. Have a contact with a recorded reply (1 回覆 / 1 reply).
2. Open 聯繫人 (Contacts), click 全部重置 (Reset all) and accept.

## Expected
The confirmation says that replies will be deleted (or the replies are kept).

## Actual
Alert "重置成功！" ("Reset successful!"); all contacts are PENDING; the reply count is 0.

## Evidence
- Screenshot: ![26-reset-all-deletes-replies.png](../explorations/2026-10-28-core-journeys/26-reset-all-deletes-replies.png)

## Environment
- Base URL: http://localhost:3000/templates/cmvongu2t0005kjy3stn25txd/contacts
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
