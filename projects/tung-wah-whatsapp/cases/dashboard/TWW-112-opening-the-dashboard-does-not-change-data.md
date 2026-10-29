---
id: TWW-112
title: "Opening the dashboard does not change or delete data"
feature: dashboard
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Just viewing 儀表板 does not change templates, contacts or replies, for any role.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)
- A template with contacts and replies; a QA viewer (created per test, deleted afterwards)

## Steps
1. Note templates, contacts and reply counts
2. Open 儀表板 as admin, then as the QA viewer
3. Compare with step 1

## Expected
- Nothing changed; a viewer's visit writes nothing
- Status updates from Twilio are the only changes, and no template or reply is removed

## Notes
The page first runs a Twilio sync on every load ("先從 Twilio 同步模板審核狀態"). The sync removes templates missing in Twilio together with their replies (TWW-069/TWW-104) and writes for viewers (BUG-039), so just opening the dashboard can trigger both.