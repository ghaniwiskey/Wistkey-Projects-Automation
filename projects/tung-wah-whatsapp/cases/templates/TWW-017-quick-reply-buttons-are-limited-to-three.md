---
id: TWW-017
title: "Quick-reply buttons are limited to three"
feature: templates
priority: P3
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
The form never allows more than 3 quick-reply buttons.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Steps
1. Log in as admin and open 新建模板
2. Click + 添加按鈕 until it disappears

## Expected
- Exactly 3 button rows are shown
- + 添加按鈕 is hidden at 3 rows
