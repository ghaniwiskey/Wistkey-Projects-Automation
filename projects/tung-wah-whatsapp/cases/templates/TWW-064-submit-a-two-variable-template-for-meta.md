---
id: TWW-064
title: "Submit a two-variable template for Meta review"
feature: templates
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
A new template with several variables and buttons reaches Meta review and shows 審核中.

## Preconditions
- An admin account (TWW_ADMIN_USER / TWW_ADMIN_PASS)

## Data
- Name qa_event_reminder_<unique>, body 您好 {{first_name}}，提醒您 {{event_date}} 的活動，請問您會出席嗎？, examples 陳大文 / 11月5日, buttons 會出席 / 不出席 / 未決定, UTILITY

## Steps
1. Open 新建模板, keep 創建後立即提交 Meta 審核 ticked
2. Fill the data, click 創建並提交審核
3. Look at the new card right away, then after 從 Twilio 同步

## Expected
- Alert "模板已創建並提交 Meta 審核！審核通過後即可使用。"
- The card shows 審核中 immediately (not 草稿), with the question title and 3 button chips
- Detail page: 發送到 WhatsApp disabled with "只有審核通過的模板才能發送消息"

## Notes
Submits to Meta (irreversible record): needs the user's approval per run. Delete the template afterwards.
Related: BUG-022 (open).
