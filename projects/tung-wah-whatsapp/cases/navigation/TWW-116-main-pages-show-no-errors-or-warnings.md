---
id: TWW-116
title: "Main pages show no errors or warnings in the browser console"
feature: navigation
priority: P3
tags: [regression]
envs: [all]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Normal use of the app logs no errors or warnings in the browser console, for every role.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)
- A QA editor and a QA viewer (created per test, deleted afterwards)

## Steps
1. Open the browser console (F12 > Console) and keep it open
2. As admin open 儀表板, 消息模版, a template (each tab: 聯絡人, 回覆統計, 變數映射), its contacts and edit pages, 用戶管理 and its 添加用户 dialog
3. Repeat the page visits as the QA editor and the QA viewer

## Expected
- No red errors, warnings or failed requests (4xx/5xx) on pages the role is allowed to open
- Pages that do not exist may log a 404 for that page only

## Notes
2026-10-29 sweep with Playwright (console, page errors, failed requests): admin clean except the 添加用户 dialog warning (BUG-042). Editor and viewer get 404 errors on templates they did not create; that is BUG-038/BUG-039, not counted here.
