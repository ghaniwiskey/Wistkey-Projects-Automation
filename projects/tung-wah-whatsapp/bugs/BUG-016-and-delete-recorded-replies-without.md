---
id: BUG-016
title: "重置 (Reset) and 全部重置 (Reset all) delete recorded replies without warning"
severity: major
status: verified
env: local
url: "http://localhost:3000/templates/<template id>/contacts"
updated: 2026-10-29T09:31:29.357Z
found: 2026-10-28T07:16:23.041Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-055]
frequency: always
---
## Summary
Resetting contacts also deletes their recorded replies, and neither reset button warns about it. One click can wipe a whole campaign's answers.

## Steps to reproduce
1. Set up replies (see Before you start). Send an APPROVED template to your number 852<P> and reply from your phone, so the template shows 1 回覆 (1 reply).
2. Open 聯繫人 (Contacts), click 全部重置 (Reset all) and accept.
3. Check 回覆統計 (Reply statistics).

## Expected
The confirmation says replies will be deleted (or the replies are kept).

## Actual
- 全部重置 (Reset all) only asks "確定要將所有聯繫人重置為待發送狀態嗎？" ("Are you sure you want to reset all contacts to pending?"), with no word about replies.
- After accepting: "重置成功！" ("Reset successful!"), all contacts are PENDING (待發送), and the reply count is 0.
- The single 重置 (Reset) button deletes the reply too, with no confirmation at all.

## Evidence
- Screenshot: ![26-reset-all-deletes-replies.png](../explorations/2026-10-28-core-journeys/26-reset-all-deletes-replies.png)

## Environment
- Base URL: http://localhost:3000/templates/<template id>/contacts
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
- 2026-10-28: steps made reproducible on any local setup (placeholders <P>, <template id>, <n> and test data described row by row instead of our template IDs, phone and data files); Summary shortened to 1-2 sentences; our observed values kept under Actual ("Our run").
- 2026-10-29: status open -> verified; Retest passed in runs/2026-10-29_1630_local_manual (dev fix commit af9a789)..
