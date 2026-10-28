---
id: TWW-038
title: "Send with no pending contacts shows a message"
feature: sending
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Clicking send when everyone was already sent does nothing harmful.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Steps
1. Log in as admin, open an approved template whose contacts are all 已發送
2. Click 發送到 WhatsApp and confirm

## Expected
- The confirmation reads "確定要發送消息給所有待發送的聯繫人嗎？"
- Alert "沒有待發送的聯繫人"; no message is sent
