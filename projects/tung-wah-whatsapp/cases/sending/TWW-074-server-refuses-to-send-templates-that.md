---
id: TWW-074
title: "Server refuses to send templates that are not approved"
feature: sending
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
The approval rule cannot be bypassed.

## Preconditions
- An admin account (TWW_ADMIN_USER / TWW_ADMIN_PASS)
- A pending or draft template with a pending contact

## Steps
1. Call the send API directly for that template

## Expected
- 403 "只有審核通過的模板才能發送消息"; no message is sent
