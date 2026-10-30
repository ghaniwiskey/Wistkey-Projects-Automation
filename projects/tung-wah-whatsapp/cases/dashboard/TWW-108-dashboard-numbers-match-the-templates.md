---
id: TWW-108
title: "Dashboard numbers match the templates' contacts and replies"
feature: dashboard
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-29
updated: 2026-10-30
---

## Goal
The 儀表板 cards (本月已發送, 本月發送失敗, 回覆率, 總聯繫人數, 總模板數) and the 模板審核狀態 table show the same numbers as the templates themselves.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)
- At least one approved template with sent contacts, one failed contact and one reply this month

## Data
- Recipient: WhatsApp +852 6524 8661 only (README > Testing permissions)

## Steps
1. Note per template: contacts, sent this month, failed this month, replies (from the contacts page and 回覆統計)
2. Open 儀表板

## Expected
- 本月已發送, 本月發送失敗, 總聯繫人數 and 總模板數 equal the sums of all local template data.
- 回覆率 = replies ÷ sent, counting only templates with 是否需要回覆 = 是.
- 模板審核狀態 lists Twilio-backed templates with matching status, reply requirement, contacts and replies; local-only templates may be absent.

## Notes
BUG-041 role scoping is verified. BUG-043 is wont-fix at the user’s decision on 2026-10-30: totals/message records may include local-only templates while the status table lists only Twilio-backed templates. This accepted difference is not a failed check. The historic run result is retained as observed, not rewritten as a pass.
