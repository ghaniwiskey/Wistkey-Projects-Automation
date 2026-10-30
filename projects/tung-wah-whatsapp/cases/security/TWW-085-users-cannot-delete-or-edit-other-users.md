---
id: TWW-085
title: "Editors can edit and delete any template; viewers cannot"
feature: security
priority: P0
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-30
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
Admins and editors manage shared templates; viewers cannot write. BUG-029 verified for the server-side permission-before-delete rule. Broad BUG-038 was superseded, with export tracked separately as BUG-044. On 2026-10-30, viewer PATCH/DELETE denial, editor question edit and stale-local deletion were checked, but live editor-initiated Twilio deletion was not exercised; this case was excluded from the executed-case results. Never use a real or approved template. Clean up disposable drafts afterwards.
