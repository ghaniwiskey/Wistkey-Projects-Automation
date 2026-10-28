---
id: SBF-048
title: "Customer can buy a pre-order product and the order shows it as pre-order"
feature: checkout
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Pre-order items are sold with a clear status and do not break stock.

## Preconditions
- A product with pre-order quantity found at runtime in CRM Inventory (View by Variants); if none, ask before enabling pre-order on a product

## Data
- Bank Transfer (fn-bank-transfer), store pickup

## Steps
1. Open the product on the eShop and add 1 to the cart
2. Place the order
3. Open the order in My Orders and the CRM, and the product row in Inventory

## Expected
- Product page and cart say it is a pre-order (with the expected date if set)
- The order line is marked pre-order; Pre-order qty changes and Available never goes negative
- Cleanup: void the order

## Notes
Gap from the 2026-10-29 critical-flow review, second pass (no existing case found by search). Never tested.
