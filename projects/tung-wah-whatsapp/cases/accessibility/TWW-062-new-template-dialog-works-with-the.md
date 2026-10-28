---
id: TWW-062
title: "New template dialog works with the keyboard"
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
- Focus starts in the dialog and stays inside while tabbing
- Escape closes it
- It is exposed as a dialog to screen readers

## Notes
The 添加用户 dialog already behaves correctly.
Related: BUG-020 (open).
