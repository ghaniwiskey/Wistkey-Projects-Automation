---
id: TWW-100
title: "Delete a user who created templates or uploaded contacts"
feature: users
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Removing a staff member either works and keeps their data with a clear owner, or explains why it cannot be done.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)
- A QA editor qa-editor-<unique>@example.test who created a draft template (no Meta submission) and uploaded contacts to it

## Steps
1. As admin open 用戶管理, delete the QA editor and confirm
2. Open /templates as admin

## Expected
- Either the user is deleted and their template and contacts are kept with a visible owner, or
- a clear message explains the user still owns templates (not a generic 刪除失敗)

## Notes
From the code: templates and uploads reference the user without cascade, so the delete likely fails with 500 刪除失敗. Creating the Twilio draft needs the user's approval per run (README). Clean up the template and user afterwards.
