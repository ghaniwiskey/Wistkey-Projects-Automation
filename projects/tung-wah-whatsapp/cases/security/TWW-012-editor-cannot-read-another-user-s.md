---
id: TWW-012
title: "Editor can see every template's contacts and report"
feature: security
priority: P0
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-30
---

## Goal
Editors work on all campaigns, not only their own.

## Preconditions
- Admin account (TWW_QA_ADMIN_* in .env)
- The admin creates a QA editor (and, for viewer checks, a QA viewer) in 用戶管理 > 添加用戶 and deletes them afterwards

## Data
- Excel file projects/tung-wah-whatsapp/data/contacts-valid-hk.xlsx

## Steps
1. As admin create a draft template qa_owner_<unique> (Meta unticked) and upload the contacts file to it
2. Log out and log in as the QA editor
3. On 消息模版 click 從 Twilio 同步
4. Click the qa_owner_<unique> card and open 聯繫人
5. Click 下載報表
6. Log back in as admin and delete qa_owner_<unique> (cleanup)

## Expected
- After sync the editor's list shows qa_owner_<unique> and the other templates
- The template page, the contacts page (QA Tester with phone and member data) and the report download work

## Notes
Intended roles: editors may access every template. Retest runs/2026-10-30_1349_local_manual: shared detail and contacts now return 200, but report download still returns 404 模板不存在. Remaining BUG-038 failure is the export route owner check.
