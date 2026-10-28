---
id: SBF-036
title: "Double-clicking Proceed to checkout creates only one order"
feature: checkout
priority: P0
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
A customer who clicks Proceed to checkout twice (or on a slow connection) is charged and reserved for one order only.

## Preconditions
- Logged-in QA member, cart empty, promo popup and notification prompt dismissed

## Data
- A non-quota product found at runtime
- Bank Transfer (fn-bank-transfer), store pickup 荔枝角

## Steps
1. Add 1 unit of the product to the cart and open /checkout
2. Fill the pickup details, select Bank Transfer and tick 結帳前同意
3. Double-click Proceed to checkout quickly
4. Open My Orders and the CRM order list (filter by the member)

## Expected
- Step 3: one thank-you page with one order number; the button is disabled or ignores the second click
- Step 4: exactly one new order for the member; the product Available in TaiPo dropped by 1, not 2
- Cleanup: void the order in the CRM

## Notes
Gap from the 2026-10-29 critical-flow review (no existing case found by search). Never tested.
