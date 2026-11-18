---
id: HLM-007
title: "The handheld refuses to check out an expired chemical and says why"
feature: check-out
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Expired check-out on the handheld

Verify that checking out an expired chemical on the handheld is refused with the reason, and the item stays IN.

## Preconditions
- A chemical with status IN that is past its expiry date

## Data
- Type: For Use

## Steps
1. On the handheld tap Check-out, find the expired chemical, choose For Use, enter remarks, Add to list
2. Verify, Review check-out, Confirm check-out

## Expected
- The app says the item is expired and cannot be checked out
- The record is not kept in the Upload queue for retry
- On the web the item is still IN

## Notes
Fails 2026-11-18 (003000012): the server refuses it (400) but the app reports a connection failure and keeps it for retry (BUG-001).
