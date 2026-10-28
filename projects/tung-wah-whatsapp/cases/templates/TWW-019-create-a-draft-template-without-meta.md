---
id: TWW-019
title: "Create a draft template without Meta submission"
feature: templates
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
A template can be created in Twilio as a draft and keeps its question title.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Steps
1. Log in as admin and open 新建模板
2. Untick 創建後立即提交 Meta 審核
3. Enter question title **QA question <unique>**, name **qa_draft_<unique>**, body **QA draft, please ignore.**, one button **OK**
4. Click 創建模板
5. Delete the template afterwards (cleanup)

## Expected
- Alert "模板已創建！"; the card shows status 草稿 and an HX… Twilio SID
- The detail page shows 問題：QA question <unique>

## Notes
Writes to the real Twilio account (content only, no Meta submission). Needs the user's approval per run (project README > Testing permissions).
