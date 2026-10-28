---
id: TWW-091
title: "Failed contacts are retried on the next send and sent contacts are not"
feature: sending
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Clicking send again retries failed messages only.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)
- An approved template with a mapped variable

## Data
- Excel: 1 row +852 6524 8661, 1 row with a number Twilio rejects at the API (e.g. 852<unique 8 digits> not on WhatsApp)
- Recipient: WhatsApp +852 6524 8661 only

## Steps
1. Upload the file and send
2. After 10 seconds click 刷新 and note each contact status
3. Click send again

## Expected
- The rejected contact is shown as failed, not 已發送
- The second send reports 1 contact and sends only to the failed one
- +852 6524 8661 receives only one message in total

## Notes
From the code: the send route selects PENDING and FAILED contacts. A message Twilio accepts but later marks Undelivered stays 已發送 (BUG-013), so the number must fail at the API call.
