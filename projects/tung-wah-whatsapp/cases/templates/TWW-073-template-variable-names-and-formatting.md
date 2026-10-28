---
id: TWW-073
title: "Template variable names and formatting are accepted"
feature: templates
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Common variable styles and WhatsApp formatting work.

## Preconditions
- An admin account (TWW_ADMIN_USER / TWW_ADMIN_PASS)

## Steps
1. Create drafts with body "A {{1}} B {{ first name }} C {{姓名}} D {{first_name}}" (examples x/y/z/w) and "你好 😀 *重要通知*：_活動_ ~取消~" with button "👍 收到"
2. Delete them (cleanup)

## Expected
- All 4 variables are detected with an example field each
- Both drafts are created; emoji and formatting are shown on the card
