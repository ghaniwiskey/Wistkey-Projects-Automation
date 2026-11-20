---
id: SCRM-189
title: "Web POS deducts the fixed amount when a code meets its spending requirement"
feature: pos
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-11-20
updated: 2026-11-20
---

## Goal
Verify that the discount is a fixed amount on an above-cutoff cart.

## Preconditions
- An active fixed-amount minimum-spend code applies to this store. Turn off unrelated discounts in the test cart.

## Data
- Example: Gifted deducts HKD 23 over HKD 200. Use eligible products.

## Steps
1. Open a participating store in Web POS.
2. Build a basket with an eligible subtotal above the threshold.
3. Enter and apply the fixed-amount promotion code.
4. Clear the test cart without checkout.

## Expected
- The cart shows the promotion and deducts the configured fixed amount. A HKD 249 cart with a HKD 23 offer totals HKD 226.
