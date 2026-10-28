---
id: TWW-007
title: "Admin deletes a user after confirmation"
feature: users
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Deleting a user asks for confirmation and removes the user.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Steps
1. Log in as the admin and create a QA user
2. Click the delete (trash) icon on the QA user and cancel the confirmation
3. Click it again and confirm

## Expected
- The confirmation text is "確定要刪除此用户嗎？"
- Cancel keeps the user
- Confirm removes the user from 用户列表; other users and their templates are unchanged
