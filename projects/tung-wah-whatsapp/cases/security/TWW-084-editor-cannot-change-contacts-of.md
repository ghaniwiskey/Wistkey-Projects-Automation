---
id: TWW-084
title: "Editor cannot change contacts of another user's template"
feature: security
priority: P0
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-29
---

## Goal
Contacts can only be reset or deleted by the template owner.

## Preconditions
- Admin account (TWW_QA_ADMIN_* in .env)
- The admin creates a QA editor (and, for viewer cases, a QA viewer) in 用戶管理 > 添加用户 and deletes them afterwards

## Data
- Excel file projects/tung-wah-whatsapp/data/contacts-valid-hk.xlsx

## Steps
1. As admin create a draft template qa_owner_<unique> and upload the contacts file
2. Log in as the QA editor, click 從 Twilio 同步 and open the qa_owner_<unique> card
3. Add /contacts to the URL and open it
4. Click 全部重置 and confirm
5. Click the trash icon of QA Tester and confirm
6. Log in as admin, open the template's 聯繫人 (then delete the template as cleanup)

## Expected
- The editor cannot reach the contacts page, or 全部重置 and delete are refused with a no-permission message
- As admin, QA Tester is still there with its original status

## Notes
Related: BUG-001 verified 2026-10-29 (dev fix af9a789). Only use QA contacts: with the bug present the actions really change data (2026-10-28: "重置成功！", contact deleted).
