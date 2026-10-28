---
id: TWW-004
title: "Duplicate email is rejected when adding a user"
feature: users
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
A user cannot be created with an email that already exists.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Steps
1. Log in as the admin and open 添加用户
2. Enter any name, the admin's own email, password **Qa123456!**
3. Click 創建用户

## Expected
- An alert shows "郵箱已存在"
- No second user with that email appears in the list
