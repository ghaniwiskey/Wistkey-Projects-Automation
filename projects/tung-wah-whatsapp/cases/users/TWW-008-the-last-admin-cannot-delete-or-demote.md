---
id: TWW-008
title: "The last admin cannot delete or demote itself"
feature: users
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
The system can never end up without an admin.

## Steps
1. Log in as the only admin and open 用戶管理
2. Click the delete icon on your own row
3. Change your own role dropdown to 編輯者

## Expected
- Deleting or demoting the last admin is blocked with a clear message (or the controls are disabled on your own row)
- You stay logged in as admin

## Notes
Not executed on 2026-10-28: the UI shows the generic delete confirmation on the only admin row, and running it could lock everyone out. Waiting on the question about intended behavior.
Related: Q-005.
