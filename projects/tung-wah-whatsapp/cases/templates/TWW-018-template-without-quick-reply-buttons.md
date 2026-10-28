---
id: TWW-018
title: "Template without quick-reply buttons can be created"
feature: templates
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Buttons are optional ("最多 3 個"), as with the existing welcome_greetings template.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Steps
1. Log in as admin and open 新建模板, untick Meta submission
2. Enter a valid name **qa_no_buttons_<unique>** and body **hello**
3. Remove both empty button rows (or leave them empty)
4. Click 創建模板, then delete the template (cleanup)

## Expected
- The template is created without buttons
- No "請至少添加一個按鈕" alert

## Notes
Currently the form alerts "請至少添加一個按鈕". Intended behavior is open (see question).
Related: Q-001.
