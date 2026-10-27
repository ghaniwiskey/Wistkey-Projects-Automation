---
id: SBF-028
title: "Only one of two customers can buy the last unit of a product"
feature: checkout
priority: P0
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
The eShop never sells more units than are available, even when two carts hold the last one.

## Preconditions
- A non-quota product whose stock in the warehouse serving Online Shop (TaiPo, see Q-009) is small, found at runtime in CRM Inventory; if none, create it with a transfer of 1 unit to TaiPo (SCRM-028) and note the product (available = 1 for the test)
- Two browser sessions: a QA member and a guest (or a second QA member), both carts empty

## Data
- Bank Transfer (fn-bank-transfer) only; store pickup

## Steps
1. Session A and session B each add 1 unit of the product to the cart -> Expect: both get "Item added successfully"
2. Both open /checkout and fill the details up to Proceed to checkout
3. Session A clicks Proceed to checkout
4. Session B clicks Proceed to checkout
5. CRM: read the product row in Inventory and the order list

## Expected
- Step 3: thank-you page with an order number
- Step 4: refused with a message that the product is out of stock / not enough stock; no second order is created
- Step 5: exactly one new order; Available for the warehouse is 0, never negative
- Cleanup: void the order (stock returns to 1) and empty both carts

## Notes
Gap from the 2026-10-28 coverage review. The CRM order list already showed rows with negative available stock "(-1 / 0)" on 2026-10-27 (risk). Related: BUG-017 (Add To Cart and checkout use different stock totals).
