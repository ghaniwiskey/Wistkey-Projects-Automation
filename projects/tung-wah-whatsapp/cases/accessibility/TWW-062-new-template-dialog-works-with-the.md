---
id: TWW-062
title: "New template dialog opens, can be filled and closed with its buttons"
feature: accessibility
priority: P3
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Keyboard users can use and leave the create dialog.

## Preconditions
- An admin account (TWW_ADMIN_USER / TWW_ADMIN_PASS)

## Steps
1. Open 新建模板
2. Press Tab repeatedly
3. Press Escape

## Expected
- The dialog opens from 新建模板 and its fields can be filled
- X and 取消 close it
- Escape, focus trapping and role=dialog are not checked (BUG-020, wont-fix)

## Notes
The 添加用户 dialog already behaves correctly.
BUG-020, closed as wont-fix (2026-10-28): the expected result above checks the accepted behavior.
