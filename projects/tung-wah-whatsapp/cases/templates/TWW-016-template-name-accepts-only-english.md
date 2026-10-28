---
id: TWW-016
title: "Template name accepts only English letters, digits and underscore"
feature: templates
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Invalid WhatsApp template names are caught before reaching Twilio/Meta.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Steps
1. Log in as admin and open 新建模板
2. Untick Meta submission
3. Enter name **My Template 測試!**, body **hello**, one button **OK**
4. Click 創建模板

## Expected
- A validation message explains the allowed characters (as in the field hint "英文、數字、底線")
- No template is created in the app or in Twilio

## Notes
If it is created anyway, delete it from the app (this also deletes it in Twilio).
Related: BUG-006 (open).
