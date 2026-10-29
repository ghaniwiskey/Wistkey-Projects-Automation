---
id: TWW-014
title: "Viewer cannot create templates or upload contacts"
feature: security
priority: P0
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-29
---

## Goal
The 查看者 role is read-only.

## Preconditions
- Admin account (TWW_QA_ADMIN_* in .env)
- The admin creates a QA editor (and, for viewer cases, a QA viewer) in 用戶管理 > 添加用户 and deletes them afterwards

## Data
- Excel file projects/tung-wah-whatsapp/data/contacts-valid-hk.xlsx

## Steps
1. Log in as the QA viewer
2. On 消息模版 click 從 Twilio 同步
3. Click 新建模板, untick Meta, enter qa_viewer_<unique>, body "QA viewer draft", button OK, click 創建模板
4. If created, open it and upload the contacts file
5. Delete anything created (cleanup)

## Expected
- 新建模板 and 從 Twilio 同步 are not offered to a viewer (or refused with a no-permission message)
- No template is created and no contacts are uploaded
- The viewer's list shows no other users' templates

## Notes
Related: BUG-002 verified 2026-10-29 (dev fix af9a789). Sending as a viewer cannot be reached in the UI (needs an approved template the viewer owns); TWW-013 covers send through the API. On 2026-10-28 the viewer synced (saw all admin templates), created a template ("模板已創建！") and uploaded a contact ("上傳成功！").
