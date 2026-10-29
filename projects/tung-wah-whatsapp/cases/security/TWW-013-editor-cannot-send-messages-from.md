---
id: TWW-013
title: "Editor cannot send messages from another user's template (API)"
feature: security
priority: P0
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-29
---

## Goal
Only the owner can trigger a WhatsApp send for a template.

## Preconditions
- Admin account (TWW_QA_ADMIN_* in .env)
- The admin creates a QA editor (and, for viewer cases, a QA viewer) in 用戶管理 > 添加用户 and deletes them afterwards
- An admin template whose contacts are all already sent (so nothing can go out)

## Steps
1. Log in as the QA editor
2. Call the send endpoint (POST /api/send) with the admin template's ID

## Expected
- Refused with 403/404 before any contact check
- No message is queued

## Notes
API-only on purpose: the editor sees "模板不存在" on the template page, so there is no send button to click. Use only templates without pending contacts, otherwise a real WhatsApp message goes out. Related: BUG-001 verified 2026-10-29 (dev fix af9a789).
