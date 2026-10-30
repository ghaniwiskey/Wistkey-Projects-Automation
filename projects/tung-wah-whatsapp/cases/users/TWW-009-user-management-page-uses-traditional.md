---
id: TWW-009
title: "User management remains usable with accepted Chinese wording"
feature: users
priority: P3
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-30
---

## Goal
User management remains usable with the accepted Chinese wording.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Steps
1. Log in as the admin and open 用戶管理
2. Click 添加用户

## Expected
- The user management page and add-user dialog remain readable and usable.
- Existing Simplified wording, including the seeded admin name 系统管理员, is accepted and is not a failed check.

## Notes
BUG-009 is wont-fix at the user’s decision on 2026-10-30. The seeded admin name 系统管理员 and existing Simplified wording are accepted; their presence alone is not a failure. This task did not rerun this language case.
