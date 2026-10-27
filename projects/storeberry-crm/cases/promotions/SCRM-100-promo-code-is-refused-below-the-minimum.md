---
id: SCRM-100
title: "Promo code is refused when the basket is below the minimum spend"
feature: promotions
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Customers get a clear message when their basket does not qualify for a minimum-spend code.

## Preconditions
- NAKAJIMA cake (HKD 0.10) is sold on the eShop

## Data
- A minimum-spend promotion created at runtime as in SCRM-098 (X = 700, code `<unique>`)

## Steps
1. As a guest, add only the NAKAJIMA cake to the cart and open checkout
2. Enter the code and click APPLY

## Expected
- Message "Current shopping cart does not meet the promotion code conditions"
- No Basket Discount line; Total stays HKD $0.10
- Cleanup: empty the cart; delete the promotion

## Notes
2026-10-27 manual: pass.
