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
An eGift outside its reserve period is refused with a visible message and no points are taken.

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

## Notes
Verified 2026-10-27: the toast "Gift out of reserve period" appears bottom right for a few seconds (read toasts right after OK, not only modals). The stack trace in the error response (BUG-016) was closed as won't fix (2026-10-27): accepted behavior, not checked here.
