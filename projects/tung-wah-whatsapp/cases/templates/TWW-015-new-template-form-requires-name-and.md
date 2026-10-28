---
id: TWW-015
title: "New template form requires name and content"
feature: templates
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
The create form stops when name or body is missing.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Steps
1. Log in as admin, open 消息模版 and click 新建模板
2. Untick 創建後立即提交 Meta 審核
3. Click 創建模板 with every field empty

## Expected
- An alert shows "請填寫模板名稱和內容"
- No request is sent and no template is added
