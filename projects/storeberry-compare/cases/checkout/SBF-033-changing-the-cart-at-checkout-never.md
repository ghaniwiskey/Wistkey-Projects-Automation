---
id: SBF-033
title: "Changing the cart at checkout never leaves a shipping fee without a shipping method"
feature: checkout
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
The summary always matches the selected shipping method after the cart changes.

## Preconditions
- A QA member; a weighted product (e.g. C, 1.000 kg) in the cart
- A paid flat-fee method read from CRM Online Store > Shipping at runtime (e.g. Testing: flat HKD 30, free from HKD 1600)

## Steps
1. Open /checkout, choose the paid method -> note Shipping Fee and Total
2. Change the cart: + / - a quantity, or remove a line with the trash icon
3. Read Shipping Method and the Summary without reloading

## Expected
- Step 1: Shipping Fee = the method fee, Total = Discounted Total + fee
- Step 3: either the method stays selected and the fee is recomputed for the new basket, or the method is cleared and Shipping Fee shows '-' / 0 with Total = Discounted Total; never a fee with no method selected

## Notes
Found in explorations/2026-10-28-shipping-fees-last-unit.md. Related: Q-006 (removing a cart item clears shipping details).
