---
id: SBF-053
title: "A member whose session expires during checkout is asked to log in and keeps the cart"
feature: checkout
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
An expired login never places an order as a guest or under the wrong account and never loses the cart.

## Preconditions
- Logged-in QA member with a product in the cart, on /checkout

## Data
- Bank Transfer (fn-bank-transfer)

## Steps
1. Delete the session cookie (or log out in another tab)
2. Proceed to checkout

## Expected
- The customer is told to log in again; after logging in the cart is still there
- No order is created as a guest; placing it after login gives one order on the member

## Notes
Gap from the 2026-10-29 critical-flow review, third pass (no existing case found by search). Never tested.
