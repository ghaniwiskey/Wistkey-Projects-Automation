---
id: SBF-025
title: "Checkout accepts the quantity that Add To Cart accepted"
feature: checkout
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Product page and checkout agree on how many units can be bought.

## Preconditions
- product test 2 has more online stock in total than in TaiPo Warehouse alone (e.g. Office 44, TaiPo 8)

## Data
- Quantity Q = TaiPo available + 1 (9 on 2026-10-27)

## Steps
1. As a guest with an empty cart open product test 2, set quantity Q, click Add To Cart -> Expect: "Item added successfully"
2. Open /checkout and look at the product test 2 line

## Expected
- No "Not enough stock" on the line; Sub. Total = unit price x Q
- If the stock cannot fulfil Q, step 1 must already refuse it with the available quantity
- Cleanup: empty the cart

## Notes
Currently fails: BUG-017 (2026-10-27): line shows "Not enough stock" for 9 (and 52), clears at 8. Not checked whether Proceed to checkout is blocked.
