---
id: SCRM-134
title: "Partial return of an order that upgraded the member re-evaluates level and level spending"
feature: loyalty
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
A return after a level upgrade leaves the member on the level and spending their kept purchases justify.

## Preconditions
- A QA member just below a level threshold (Loyalty level settings, found at runtime)
- A paid two-item eShop order that takes level spending over the threshold (SCRM-119)

## Data
- Refund by Bank Transfer

## Steps
1. Note Member Level, level spending, Point Expiry Date and Point History after the upgrade
2. Exchange / Partial Return one item so the kept total no longer reaches the threshold
3. Reread level, level spending, Point Expiry Date, Point History and any upgrade reward

## Expected
- Level spending = spending before the order + kept amount
- Level and upgrade reward follow the product owner's answer in Q-001

## Notes
2026-10-28 (TXN0126102800001, not recorded as a run because Q-001 is open): spending 717 + 1,300 upgraded Level 2 -> 3 (shown $17.00 / $3,000, Point Expiry 2029-10-27). Returning C (487.50) moved the member back to Level 2 with spending 1,042.00 instead of 1,529.50 (BUG-028) and Point Expiry back to 2027-10-27. Related: Q-001, BUG-028.
