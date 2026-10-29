---
id: TWW-085
title: "Editors can edit and delete any template; viewers cannot"
feature: security
priority: P0
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-29
---

## Goal
Template changes follow the role, and the Twilio delete never happens without permission.

## Preconditions
- A QA editor and a QA viewer created by the admin (delete afterwards)
- Two disposable QA drafts owned by the admin (Twilio draft approval per run)

## Steps
1. As the QA viewer call PATCH /api/templates/<draft 1 id> with a new questionTitle, then DELETE it
2. Check draft 1 in Twilio (Content API or console)
3. As the QA editor open draft 2, change 問題標題 with 編輯, then delete it with 刪除
4. Check draft 2 in Twilio

## Expected
- Viewer: both calls return 403 無權限; draft 1 is unchanged and still exists in Twilio
- Editor: the edit is saved and the delete removes draft 2 from the app and from Twilio

## Notes
Intended roles (product owner, 2026-10-29): admin = everything incl. 用戶管理; editor = sync and create/edit/delete every template, no 用戶管理; viewer = sees every template and can sync, read-only. The editor part fails on BUG-038 (open). BUG-029 (Twilio delete before the permission check) verified 2026-10-29. NEVER use a real or approved template. Delete draft 1 as admin afterwards.
