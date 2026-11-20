---
id: SCRM-187
title: "Web POS takes 20% off when the cart exceeds the promo code threshold"
feature: pos
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-11-20
updated: 2026-11-20
---

## Goal
Verify the discount amount on a qualifying basket.

## Preconditions
- An active 20% promo code advertised for spending above HKD 50 applies to the selected store. Eligible products are available.

## Data
- Use eligible items with no competing discount, or turn off unrelated basket offers for the cart.

## Steps
1. Log in to Storeberry with a staff account.
2. Open Web POS for a participating store.
3. Add eligible items totaling HKD 100.
4. Enter the promo code and click Apply.
5. Clear the test cart without checking out.

## Expected
- The named offer deducts HKD 20 and the cart total is HKD 80.
