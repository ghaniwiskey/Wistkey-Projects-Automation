---
id: TWW-018
title: "Template without quick-reply buttons can be created"
feature: templates
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-30
---

## Goal
A notification configured not to require a reply can be created without quick-reply buttons.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Steps
1. Log in as admin and open 新建模板, untick Meta submission
2. Turn off 此模板需要用戶回覆 (This template requires a user reply)
3. Enter a valid name **qa_no_buttons_<unique>** and body **hello**
4. Click 創建模板, then delete the disposable template (cleanup)

## Expected
- The template is created without buttons
- No "請至少添加一個按鈕" alert

## Notes
The attached requirements explicitly include messages without requiring replies. The current create UI and API support requiresReply=false and twilio/text. This case now uses that switch; the historic fail did not cover the current no-reply path and is not a current missing-feature verdict. Needs a fresh retest. Creating/deleting a Twilio draft needs explicit run-specific approval; no Meta submission. TWW-121 separately covers sending an approved notification. Q-001 remains relevant only to button rules when replies are required.
