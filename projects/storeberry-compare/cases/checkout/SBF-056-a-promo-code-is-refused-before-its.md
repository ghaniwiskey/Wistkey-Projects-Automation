---
id: SBF-056
title: "A promo code is refused before its start date and accepted once it starts"
feature: checkout
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Promotions cannot be used before they go live.

## Preconditions
- A QA promo code promotion we create with a start 1-2 hours ahead (SCRM-098 flow)

## Data
- Basket above the minimum spend

## Steps
1. Apply the code before the start
2. Apply it again after the start hour

## Expected
- Step 1: refused with the invalid/expired message, totals unchanged
- Step 2: discount applied
- Cleanup: delete the QA promotion

## Notes
Gap from the 2026-10-29 critical-flow review, third pass (no existing case found by search). Never tested. SCRM-101 covers expired codes only.
