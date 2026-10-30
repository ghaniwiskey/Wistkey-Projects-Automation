---
id: TWW-119
title: "Duplicate delivery callbacks leave the recorded status and times unchanged"
feature: sending
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Receive a delivery event twice

Verify that repeated Delivered or Read events do not duplicate records or replace the first recorded timestamps.

## Preconditions
- An admin account and a disposable contact with a tracked WhatsApp message ID are available.
- A test setup can replay correctly signed Twilio status events without sending messages to real recipients.

## Data
- Use identical signed event payloads for each replay.

## Steps
1. Log in with your admin account and open the test contact.
2. Replay a Delivered event and note the delivered time.
3. Replay the same Delivered event twice and refresh the contact.
4. Replay a Read event and note the read time.
5. Replay the same Read event twice and refresh the contact.

## Expected
- There remains exactly one contact and no new reply is created by status events.
- The first delivered time and first read time are unchanged after duplicate events.

## Notes
Coverage gap found during 2026-10-30 review; existing TWW-039 does not repeat identical callbacks. Case only, not executed. No new real send approved.
