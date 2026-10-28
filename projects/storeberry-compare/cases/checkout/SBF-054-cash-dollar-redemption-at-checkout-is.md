---
id: SBF-054
title: "Cash dollar redemption at checkout is capped at the per-order limit and needs enough points"
feature: checkout
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Members cannot redeem more cash dollars than the rule allows or than they have.

## Preconditions
- A QA member with more than 200 points (adjust with SCRM-081 if needed)
- Cash dollar rule read at runtime (context: 100 points = $100, at most $100 per order)

## Data
- Basket above $200 of a non-quota product

## Steps
1. At checkout try to redeem 200 points
2. Redeem the maximum allowed
3. Set the member to fewer points than needed and try again

## Expected
- Step 1: refused or capped at $100 with a message
- Step 2: discount = $100, points drop by 100 after the order
- Step 3: redemption refused; cleanup: void the order (points return)

## Notes
Gap from the 2026-10-29 critical-flow review, third pass (no existing case found by search). Never tested. SCRM-066 covers a normal redemption only.
