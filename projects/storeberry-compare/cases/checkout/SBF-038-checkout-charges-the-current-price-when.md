---
id: SBF-038
title: "Checkout charges the current price when the price changes while the item is in the cart"
feature: checkout
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
A price edited in the CRM after a customer added the item is reflected (or clearly flagged) before the order is placed, never silently charged at the old price.

## Preconditions
- A QA product we created (SCRM-002 flow) with a known price, found at runtime
- Logged-in QA member, cart empty

## Data
- Price change: <current price> to <current price + 10>
- Bank Transfer (fn-bank-transfer), store pickup

## Steps
1. Add 1 unit of the QA product to the cart
2. In the CRM edit the product price to the new value and save
3. Reload /checkout on the eShop
4. Proceed to checkout
5. Open the order in the CRM

## Expected
- Step 3: the cart and Summary show the new price (or a notice that the price changed)
- Step 5: the order line and total use the price shown at step 3
- Cleanup: void the order and restore the product price

## Notes
Gap from the 2026-10-29 critical-flow review (no existing case found by search). Never tested. Ask first if the only product available is not our own QA product (README > Testing permissions).
