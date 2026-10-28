---
id: TWW-077
title: "Logout ends the session and protects pages"
feature: auth
priority: P0
tags: [smoke]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
After 退出 the app cannot be used without logging in again.

## Preconditions
- An admin account (TWW_ADMIN_* or TWW_QA_ADMIN_* in .env)

## Steps
1. Log in as admin and open 用戶管理
2. Click 退出
3. Press the browser Back button
4. Open /templates directly

## Expected
- After 退出 the login page opens
- Back and direct URLs show the login page, not app data
- The session API returns {}
