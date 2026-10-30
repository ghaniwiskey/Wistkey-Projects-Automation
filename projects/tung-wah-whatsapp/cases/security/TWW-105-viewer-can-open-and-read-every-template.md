---
id: TWW-105
title: "Viewer can open and read every template"
feature: security
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-29
updated: 2026-10-30
---

## Goal
A viewer can follow every campaign read-only.

## Preconditions
- Admin account (TWW_QA_ADMIN_* in .env)
- A QA viewer created by the admin in 用戶管理 > 添加用戶 (delete afterwards)
- A template created by the admin with a QA contact and at least one reply

## Data
- Excel file projects/tung-wah-whatsapp/data/contacts-valid-hk.xlsx

## Steps
1. Log in as the QA viewer and open 消息模版
2. Click 從 Twilio 同步
3. Open the admin template, its 聯繫人 page and 回覆統計
4. Click 下載報表

## Expected
- After sync every template is listed (the same list the admin sees)
- The message preview, contacts, reply statistics and report are shown or downloaded
- No create, upload, mapping save, send, reset or delete control is offered (TWW-087)

## Notes
Viewer list, shared detail, contacts, reply statistics and replies work. Retest runs/2026-10-30_1349_local_manual still fails: export returns 404 模板不存在 (BUG-044), and the detail UI offers edit/delete/upload/mapping/send controls despite checked write APIs returning 403 (BUG-045). Broad BUG-039 was superseded by these focused reports.
