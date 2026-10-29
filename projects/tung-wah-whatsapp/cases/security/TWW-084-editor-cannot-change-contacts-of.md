---
id: TWW-084
title: "Editor can manage the contacts of a template another user created"
feature: security
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-29
---

## Goal
Editors can prepare contact lists on shared templates.

## Preconditions
- Admin account (TWW_QA_ADMIN_* in .env)
- The admin creates a QA editor (and, for viewer checks, a QA viewer) in 用戶管理 > 添加用戶 and deletes them afterwards

## Data
- Excel file projects/tung-wah-whatsapp/data/contacts-valid-hk.xlsx

## Steps
1. As admin create a draft template qa_owner_<unique>
2. Log in as the QA editor, click 從 Twilio 同步 and open qa_owner_<unique>
3. Upload the contacts file with 追加
4. Open 聯繫人, click 全部重置 and confirm, then delete QA Tester and confirm
5. As admin delete qa_owner_<unique> (cleanup)

## Expected
- Upload, reset and delete succeed for the editor (with the usual confirmations)

## Notes
Intended roles (product owner, 2026-10-29): admin = everything incl. 用戶管理; editor = sync and create/edit/delete every template, no 用戶管理; viewer = sees every template and can sync, read-only. Fails on BUG-038 (open). Only use QA contacts and a draft template.
