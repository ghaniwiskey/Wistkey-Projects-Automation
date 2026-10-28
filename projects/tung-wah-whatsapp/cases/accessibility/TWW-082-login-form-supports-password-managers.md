---
id: TWW-082
title: "Login form works with the keyboard"
feature: accessibility
priority: P3
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
The login form can be filled and submitted with the keyboard only. Label links, autocomplete hints and the placeholder are not checked (BUG-031 accepted as wont-fix).

## Steps
1. Open /login
2. Tab to 郵箱, type the email, Tab to 密碼, type the password, press Enter

## Expected
- Focus moves 郵箱 -> 密碼 -> 登錄 in that order
- Enter submits the form and opens /templates

## Notes
Unlinked labels, no autocomplete and the admin@tungwah.org placeholder are accepted behavior: BUG-031, closed as wont-fix (2026-10-28). Do not re-report.
