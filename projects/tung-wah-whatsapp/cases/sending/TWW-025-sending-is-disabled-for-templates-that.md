---
id: TWW-025
title: "Sending is disabled for templates that are not approved"
feature: sending
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Only 已通過 templates can be sent.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Steps
1. Log in as admin and open a 草稿 template

## Expected
- 發送到 WhatsApp is disabled
- The text "只有審核通過的模板才能發送消息" is shown
