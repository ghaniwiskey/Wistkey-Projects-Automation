---
id: SCRM-046
title: "Cart quantity changes and removal recalculate totals"
feature: storefront
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
A shopper can change a cart quantity and remove an item while totals update.

## Preconditions
- An available product can be added to an empty isolated staging cart.

## Data
- One product and a quantity greater than one, selected dynamically.

## Steps
1. Open the staging storefront in a clean, isolated test session.
2. Add one available product to the empty cart.
3. Increase its quantity, review the updated subtotal, then remove the item.

## Expected
- Changing quantity updates the cart quantity and subtotal using the displayed unit price.
- Removing the item removes it from the cart and recalculates the total.
- No checkout or order submission occurs.

## Notes
Cart-state write only. Use a clean isolated session and leave the cart empty; do not submit an order.
