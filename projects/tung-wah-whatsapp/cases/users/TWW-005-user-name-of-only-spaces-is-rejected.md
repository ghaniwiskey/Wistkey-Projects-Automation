---
id: TWW-005
title: "User name of only spaces is rejected"
feature: users
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-29
---

## Goal
A user must have a visible name.

## Steps
1. Log in as the admin and open 添加用户
2. Enter name **"   "** (spaces only), email **qa-<unique>@example.test**, password **Qa123456!**
3. Click 創建用户
4. If the user was created, delete it (cleanup)

## Expected
- The form shows a required-name error and no user is created
- No user card with an empty heading appears in 用户列表

## Notes
Related: BUG-005 verified 2026-10-29 (dev fix af9a789).
