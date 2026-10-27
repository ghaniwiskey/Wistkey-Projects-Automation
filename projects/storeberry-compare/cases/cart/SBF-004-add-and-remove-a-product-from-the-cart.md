---
id: SBF-004
title: "Add and remove a product from the cart"
feature: cart
priority: P0
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-23
updated: 2026-10-27
---

## Goal
A shopper can add a product to the cart, verify the cart line, and remove it without placing an order.

## Data
- A currently listed in-stock, non-booking product

## Steps
1. Open an in-stock product detail page
2. Add one unit to the cart
3. Open the cart and confirm the product line and quantity
4. Remove the item from the cart

## Expected
- The cart shows the selected product with quantity 1 and its price
- After removal, the cart is empty and the cart badge shows 0
- No order is submitted

## Notes
Run only in staging; the production environment is read-only. BUG-002 (cart drawer stayed empty) is verified fixed (2026-10-27): the drawer must show the added line, so this case must pass. Do not place an order during this case.
