---
id: HLM-008
title: "Records made offline wait in the Upload queue and upload when the connection is back"
feature: upload-queue
priority: P0
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Offline-first

Verify that a pre check-in done without a connection is kept on the device and uploaded once, without duplicates, when the connection returns.

## Preconditions
- An item that can be pre checked-in (new, or a returned loan)
- A way to turn the device's network off (airplane mode)

## Steps
1. Turn the handheld's network off
2. Pre check-in the item and upload
3. Open Upload queue
4. Turn the network on and tap Upload all
5. On the web open Check In / Out > Tagged Not Checked In

## Expected
- Offline the upload fails and the record is kept: "kept in the Upload queue for retry"
- The Upload queue shows the record (item, saved time, attempt) and that there is no connection
- After Upload all: "Upload complete - 1 record(s) uploaded to the server and removed from this device."
- The web lists the item once under Tagged Not Checked In

## Notes
Executed 2026-11-18 with 001000031 (returned loan): pass, except that the queue showed "Connection available" while offline (BUG-004).
