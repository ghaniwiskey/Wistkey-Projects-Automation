---
id: TWW-021
title: "Sync from Twilio lists Twilio templates"
feature: templates
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
從 Twilio 同步 refreshes the templates from Twilio.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Steps
1. Log in as admin, open 消息模版
2. Click 從 Twilio 同步

## Expected
- Alert "同步成功！共 N 個模板" where N is the number of cards
- Statuses (已通過 / 草稿) match Twilio
