---
id: TWW-002
title: "Admin creates an editor user"
feature: users
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
An admin can add a new user with the editor role.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Steps
1. Log in as the admin and open 用戶管理
2. Click 添加用户
3. Enter name **QA Editor <unique>**, email **qa-editor-<unique>@example.test**, a password of at least 6 characters, role **編輯者**
4. Click 創建用户
5. Delete the user afterwards (cleanup)

## Expected
- The dialog closes and the new user appears in 用户列表 with the 編輯者 badge, the email and "0 個模板"
- The user can log in with the given email and password
