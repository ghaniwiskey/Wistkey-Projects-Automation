---
id: TWW-108
title: "Dashboard numbers match the templates' contacts and replies"
feature: dashboard
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-29
updated: 2026-10-29
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
- 本月已發送, 本月發送失敗, 總聯繫人數 and 總模板數 equal the sums of step 1
- 回覆率 = replies ÷ sent, counting only templates with 是否需要回覆 = 是
- 模板審核狀態 lists each template with its status, 是否需要回覆, 聯絡人 and 回覆數 matching step 1

## Notes
Page added in dev fix af9a789 (2026-10-29). Code: app/api/dashboard/stats/route.ts. Related: TWW-109, TWW-110. Fails on BUG-041 (open) since 2026-10-29: the cards count only templates the user created.
