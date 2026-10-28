---
id: TWW-039
title: "Contact status follows Twilio delivery and read receipts"
feature: sending
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
The app shows Delivered / Read / Undelivered like Twilio does.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)
- ngrok tunnel for the Twilio webhook running

## Data
- Recipient: WhatsApp +852 6524 8661 only (README > Testing permissions)

## Steps
1. Make sure the Twilio status webhook reaches the app (ngrok tunnel up)
2. Send the QA contact (mapped)
3. Open the message on the phone
4. Open 聯繫人 and click 刷新

## Expected
- After delivery the contact shows a delivered state and time; after opening it shows read
- A message to a non-HK number that Twilio marks Undelivered shows as failed, not 已發送

## Notes
Related: BUG-013 (open). With the tunnel up the status only changes to READ when the member replies; deliveredAt/readAt stay empty and undelivered messages stay 已發送.
