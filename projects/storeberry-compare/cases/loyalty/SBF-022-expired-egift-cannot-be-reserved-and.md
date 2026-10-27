---
id: SBF-022
title: "Expired eGift cannot be reserved and the customer is told why"
feature: loyalty
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
An eGift outside its reserve period is refused with a visible message and no points are taken; error responses do not expose server internals.

## Preconditions
- Logged-in QA member with points
- An eGift whose reserve period has ended (e.g. /egift/detail/8 Nice meat, /egift/detail/9 testA)

## Data
- Expired eGift found at runtime

## Steps
1. Open the expired eGift detail page by URL
2. Click Reserve, then OK
3. Check the page, the member points and E-Gift Redemption Record

## Expected
- A message says the gift is out of its reserve period (or Reserve is disabled)
- No points are deducted and no reservation is created
- The API response contains no stack trace or server paths

## Notes
Currently fails: BUG-015 (silent) and BUG-016 (stack trace) (2026-10-27).
