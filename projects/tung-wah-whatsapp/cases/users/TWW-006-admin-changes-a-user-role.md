---
id: TWW-006
title: "Admin changes a user role"
feature: users
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
An admin can switch a user between 管理員, 編輯者 and 查看者.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Steps
1. Log in as the admin and create a QA user with role 編輯者
2. Change the role dropdown on the QA user to **查看者**
3. Reload the page
4. Delete the QA user (cleanup)

## Expected
- The dropdown offers 管理員, 編輯者, 查看者
- After reload the QA user shows the 查看者 badge and role
