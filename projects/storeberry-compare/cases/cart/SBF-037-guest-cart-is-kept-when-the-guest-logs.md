---
id: SBF-037
title: "Guest cart is kept when the guest logs in at checkout"
feature: cart
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
A shopper who fills the cart as a guest and logs in to check out does not lose the cart.

## Preconditions
- Logged out; QA member account from .env or created at runtime (SBF-006); the member cart is empty

## Data
- A non-quota product found at runtime

## Steps
1. As a guest add 2 units of the product to the cart
2. Open /checkout and choose to log in, then log in as the QA member
3. Open the cart / checkout again

## Expected
- Step 3: the cart still holds the product with quantity 2 and the member prices/discounts are applied
- Nothing is duplicated when the member cart already had items (repeat once with 1 unit already in the member cart: quantities add up or the rule is shown)
- Cleanup: empty the cart

## Notes
Gap from the 2026-10-29 critical-flow review (no existing case found by search). Never tested.
