---
id: HLW-062
title: "Two users checking out the same item at the same time: only one succeeds"
feature: check-in-out
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-19
updated: 2026-11-19
---

## Goal
Concurrent check-outs of one item do not create two loans or count the item twice.

## Preconditions
- Two User accounts
- An item with status IN

## Steps
1. Log in as USER1 and USER2 in two browsers and open Check Out in both
2. Both tick the same item; USER1 checks it out on Loan
3. Without refreshing, USER2 checks it out For use

## Expected
- USER2's check-out is refused with a message that the item is no longer IN
- Check In Out Report has one check-out for the item and Loan Out Report one loan
- Stock Level Report counts the item once

## Notes
Coverage review 2026-11-19. Clean-up: check the item in again.
