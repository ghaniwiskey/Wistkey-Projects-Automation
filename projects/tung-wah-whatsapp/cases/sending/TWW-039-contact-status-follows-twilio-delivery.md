---
id: TWW-039
title: "Contact status follows Twilio delivery and read receipts"
feature: sending
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-30
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
5. For failure handling, use a disposable QA contact with a message ID and stage its local status to SENT, then replay a correctly signed Twilio undelivered callback to the public webhook with an error code. Do not send to an unauthorized recipient

## Expected
- After delivery the contact shows a delivered state and time; after opening it shows read
- A message to a non-HK number that Twilio marks Undelivered shows as failed, not 已發送

## Notes
Requires PUBLIC_URL to point to the live public tunnel. BUG-013 verified in runs/2026-10-30_1349_local_manual: one real send reached DELIVERED then READ, with both timestamps and Twilio read status. Failure handling was checked with a correctly signed undelivered callback replay on that disposable contact after staging its local status to SENT; no external failed-delivery send was made. Historical records without callbacks are not backfilled.
