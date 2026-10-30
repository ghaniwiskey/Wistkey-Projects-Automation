---
id: TWW-118
title: "Delayed delivery callbacks do not downgrade a read message"
feature: sending
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Receive delivery events out of order

Verify that a read message stays read when older delivery or failure events arrive later.

## Preconditions
- An admin account and a disposable contact with a tracked WhatsApp message ID are available.
- A test setup can replay correctly signed Twilio status events without sending messages to real recipients.

## Data
- Use only disposable test records and signed callback replay.

## Steps
1. Log in with your admin account and open the test contact.
2. Replay a Read event for its tracked message and note the resulting status and read time.
3. Replay older Delivered, Sent and Undelivered events for that same message ID.
4. Refresh the contact and compare its status and read time.

## Expected
- The contact remains Read after every older event.
- The read time is unchanged, and an older failure does not add a failure state or error.

## Notes
Coverage gap found in status callback handler during 2026-10-30 review. TWW-039 covers the normal lifecycle, not out-of-order events. Case only, not executed. Use isolated disposable state; no external sends authorized.
