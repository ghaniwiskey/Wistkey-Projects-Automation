---
id: TWW-013
title: "Editor can send from a template another user created"
feature: security
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-29
---

## Goal
Editors can run campaigns on shared templates.

## Preconditions
- Admin account (TWW_QA_ADMIN_* in .env)
- The admin creates a QA editor (and, for viewer checks, a QA viewer) in 用戶管理 > 添加用戶 and deletes them afterwards
- An APPROVED template created by the admin, with only the user's test phone (+852 6524 8661) as a pending contact
- Approval for a WhatsApp send in this run (README > Testing permissions)

## Steps
1. Log in as the QA editor and open the admin's approved template
2. Click 發送到 WhatsApp

## Expected
- The send starts (發送任務已啓動) and the test phone receives the message

## Notes
Intended roles (product owner, 2026-10-29): admin = everything incl. 用戶管理; editor = sync and create/edit/delete every template, no 用戶管理; viewer = sees every template and can sync, read-only. Fails on BUG-038 (open): since af9a789 the editor gets 404 未找到 on another user's template. Sends a real message: only to the test phone.
