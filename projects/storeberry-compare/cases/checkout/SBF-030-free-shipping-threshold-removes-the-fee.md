---
id: SBF-030
title: "Free-shipping threshold removes the fee at the threshold and adds it back when the basket drops below"
feature: checkout
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
The free-shipping rule uses the right amount (before or after discounts) and re-checks when the cart changes.

## Preconditions
- A shipping method with a free-shipping threshold T, read from the shipping settings at runtime (the name ShipAnySF350free suggests T = 350; confirm)
- A QA member; products to build baskets just below, at and above T

## Steps
1. Build a basket just below T, choose the method -> note the fee
2. Add items so the basket is exactly T, then above T
3. Apply a promo code that takes the discounted total below T
4. Remove items to go below T again

## Expected
- Below T: the method's normal fee is charged
- At T and above: Shipping Fee HKD 0.00
- Step 3: the fee follows the documented basis (sub-total or discounted total); record which one the shop uses
- Step 4: the fee is charged again without reloading

## Notes
No order needed (stop before Proceed). If the basis in step 3 is unclear, raise a question rather than a bug.
