---
id: TWW-120
title: "Old delivery callbacks cannot update a contact after it is reset"
feature: sending
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Receive an old event after resetting a contact

Verify that callbacks for the previous message cannot change a contact that has been reset to Pending.

## Preconditions
- An admin account and a disposable sent contact with a recorded WhatsApp message ID are available.
- A test setup can replay correctly signed Twilio status events without sending messages to real recipients.

## Data
- Keep the previous message ID before reset. Use only disposable contact data.

## Steps
1. Log in with your admin account and note the test contact’s previous message ID.
2. Reset that test contact and confirm the reset.
3. Check that it is Pending with no previous message ID or send timestamps.
4. Replay Delivered, Read and Undelivered events referencing only the previous message ID.
5. Refresh the contact and inspect its status, times and reply count.

## Expected
- The contact stays Pending with no delivery, read or failure times from the old message.
- The previous message ID is not reattached and no reply is created.

## Notes
Coverage gap found during 2026-10-30 review. TWW-034 checks reset; TWW-039 checks callbacks, but neither covers stale events after reset. Reset can remove replies, so use a disposable record and obtain explicit run-specific approval before execution. Case only, not executed.
