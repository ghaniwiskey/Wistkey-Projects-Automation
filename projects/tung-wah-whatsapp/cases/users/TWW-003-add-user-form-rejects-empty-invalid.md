---
id: TWW-003
title: "Add user form rejects empty, invalid email and short password"
feature: users
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
The add-user form blocks invalid input before saving.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Steps
1. Log in as the admin, open 用戶管理 and click 添加用户
2. Click 創建用户 with all fields empty
3. Enter name **QA**, email **notanemail**, password **1** and click 創建用户

## Expected
- Empty submit: the 姓名 field shows "please fill out this field" and nothing is saved
- Invalid email: the email field reports the missing @
- Password: the field asks for at least 6 characters
- No user is added to the list
