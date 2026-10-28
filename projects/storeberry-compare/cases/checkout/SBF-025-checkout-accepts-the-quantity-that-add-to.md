---
id: SBF-025
title: "Checkout accepts the quantity that Add To Cart accepted"
feature: checkout
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-28
---

## Goal
Product page and checkout agree on how many units can be bought.

## Preconditions
- product test 2 has more online stock in total than in TaiPo Warehouse alone (e.g. Office 44, TaiPo 8)

## Data
- Quantity Q = TaiPo available (8 on 2026-10-27), found at runtime

## Steps
1. As a guest with an empty cart open product test 2, set quantity Q, click Add To Cart -> Expect: "Item added successfully"
2. Open /checkout and look at the product test 2 line

## Expected
- No "Not enough stock" on the line; Sub. Total = unit price x Q
- Cleanup: empty the cart

## Notes
BUG-017, closed as wont-fix (2026-10-28): Add To Cart accepting more than the checkout stock (TaiPo) is accepted behavior, so this case no longer checks quantities above the TaiPo stock; it checks that a quantity checkout can serve goes through. 2026-10-27: "Not enough stock" for 9 (and 52), cleared at 8.
