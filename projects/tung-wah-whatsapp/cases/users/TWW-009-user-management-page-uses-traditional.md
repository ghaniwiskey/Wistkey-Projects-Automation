---
id: TWW-009
title: "User management page uses Traditional Chinese consistently"
feature: users
priority: P3
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
All user-management labels are in Traditional Chinese like the rest of the app.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Steps
1. Log in as the admin and open 用戶管理
2. Click 添加用户

## Expected
- Labels read 用戶管理, 用戶列表, 添加用戶, 添加新用戶, 創建用戶, 系統管理員, and confirm text 確定要刪除此用戶嗎？
- No Simplified characters (户, 统, 员) appear

## Notes
Related: BUG-009 (open).
