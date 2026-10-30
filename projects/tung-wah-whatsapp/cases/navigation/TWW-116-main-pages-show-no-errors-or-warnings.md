---
id: TWW-116
title: "Main pages show no errors or warnings in the browser console"
feature: navigation
priority: P3
tags: [regression]
envs: [all]
automated: false
created: 2026-10-29
updated: 2026-10-30
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
- No red errors, warnings or failed requests (4xx/5xx) on pages the role is allowed to open, apart from the accepted 添加用户 dialog warning (BUG-042)
- Pages that do not exist may log a 404 for that page only

## Notes
Historical 2026-10-29 console sweep: admin clean except the accepted add-user dialog warning (BUG-042, wont-fix); editors/viewers previously received owner-only template 404s. Shared page access now works in the 2026-10-30 retest. Broad BUG-038/BUG-039 were superseded; remaining report-export 404 is BUG-044 and viewer write controls are BUG-045. Neither should be treated as accepted console noise. This complete console sweep has not been rerun.
