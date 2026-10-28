---
id: TWW-012
title: "Editor cannot see another user's contacts or report"
feature: security
priority: P0
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Contacts and reports of a template are visible only to its owner.

## Preconditions
- Admin account (TWW_QA_ADMIN_* in .env)
- The admin creates a QA editor (and, for viewer cases, a QA viewer) in 用戶管理 > 添加用户 and deletes them afterwards

## Data
- Excel file projects/tung-wah-whatsapp/data/contacts-valid-hk.xlsx

## Steps
1. As admin create a draft template qa_owner_<unique> (Meta unticked) and upload the contacts file to it
2. Log out and log in as the QA editor
3. On 消息模版 click 從 Twilio 同步
4. Click the qa_owner_<unique> card
5. In the address bar add /contacts to the template URL and open it
6. In the address bar open the report link: replace /templates/ with /api/templates/ and add /export to the template URL
7. Log back in as admin and delete qa_owner_<unique> (cleanup)

## Expected
- After sync the editor's list does not show qa_owner_<unique>
- The template page says 模板不存在
- The contacts page shows no contacts (or a no-permission message), not QA Tester's name and phone
- The report link does not download a file

## Notes
Related: BUG-001 (open), BUG-002 (open). On 2026-10-28 the card appeared after sync, the contacts page listed QA Tester with phone and member data, and the link downloaded reply_report_<id>.xlsx.
