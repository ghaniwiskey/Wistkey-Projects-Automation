---
id: TWW-045
title: "Icon buttons and add-user form work by mouse and keyboard"
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
- Trash icons, the dialog close (X) and button-row remove (x) buttons can be reached with Tab and work with Enter and a click
- The add-user inputs accept typing and the user is created
- Accessible names and linked labels are not checked (BUG-010, wont-fix)

## Notes
BUG-010, closed as wont-fix (2026-10-28): the expected result above checks the accepted behavior.
