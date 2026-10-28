---
id: TWW-045
title: "Icon buttons and form fields have accessible names"
feature: accessibility
priority: P3
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Screen readers (and getByRole/getByLabel) can find every control.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Steps
1. Log in as admin
2. Inspect the templates list, user management, add-user dialog, new-template dialog and contacts page with a screen reader or accessibility tree

## Expected
- Trash icons, the dialog close (X) and button-row remove (x) buttons have names (e.g. 刪除模板 <name>)
- The add-user inputs are labelled 姓名, 郵箱, 密碼

## Notes
Related: BUG-010 (open).
