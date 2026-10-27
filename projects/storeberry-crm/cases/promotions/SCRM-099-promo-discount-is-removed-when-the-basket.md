---
id: SCRM-099
title: "Promo discount is removed when the basket drops below the minimum spend"
feature: promotions
priority: P0
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
A minimum-spend code cannot keep its discount after items are removed at checkout.

## Preconditions
- Product C (HKD 700.00) and NAKAJIMA cake (HKD 0.10) are sold on the eShop

## Data
- A minimum-spend promotion created at runtime as in SCRM-098 (X = 700, code `<unique>`)

## Steps
1. As a guest, add product C and the NAKAJIMA cake to the cart and open checkout (Sub-total HKD $700.10)
2. Apply the code -> Expect: Basket Discount line shown
3. Remove product C from the cart with its trash icon

## Expected
- "Item remove successfully"; Sub-total HKD $0.10
- No Basket Discount line; Total HKD $0.10; the promotion box is empty with APPLY
- Cleanup: empty the cart; delete the promotion

## Notes
2026-10-27 manual: pass.
