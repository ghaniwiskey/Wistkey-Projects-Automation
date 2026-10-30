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
- After sync every template is listed (the same list the admin sees).
- The message preview, contacts, reply statistics and report are shown or downloaded.
- Visible write controls are accepted; this read-access case does not fail on their presence.

## Notes
Shared list/detail/contacts/replies now work. The 2026-10-30 retest export 404 is tracked by open BUG-044. Visible write controls are accepted behavior after BUG-045 was closed as wont-fix; do not fail this case on control visibility. Broad BUG-039 was superseded.
