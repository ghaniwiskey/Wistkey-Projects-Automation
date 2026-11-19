---
id: HLM-019
title: "Logout warns about records that are not uploaded"
feature: auth
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-11-19
updated: 2026-11-19
---

## Goal
Logout with unsent records

Verify that logging out with records in the Upload queue warns that they will be deleted and lets the user cancel.

## Preconditions
- A record waiting in the Upload queue (e.g. a pre check-in made offline)

## Steps
1. Turn the network off and make a pre check-in (it stays in the queue)
2. Tap Logout
3. Tap Cancel
4. Turn the network on and upload or delete the record

## Expected
- The dialog says all data on the device will be deleted and "1 record in the Upload queue has not been uploaded."
- Cancel keeps the user signed in with the record still in the queue

## Notes
Executed 2026-11-19 (002000020, record deleted afterwards): pass.
