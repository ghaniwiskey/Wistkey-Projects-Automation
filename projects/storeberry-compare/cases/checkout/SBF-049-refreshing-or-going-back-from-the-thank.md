---
id: SBF-049
title: "Refreshing or going Back from the thank-you page does not create a second order"
feature: checkout
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
A customer who reloads or presses Back after ordering is not charged twice.

## Preconditions
- Logged-in QA member, cart empty

## Data
- A non-quota product found at runtime
- Bank Transfer (fn-bank-transfer), store pickup

## Steps
1. Place an order and stay on the thank-you page
2. Reload the page (accept any resubmit prompt)
3. Press Back to checkout and Forward again
4. Open My Orders and the CRM order list for the member

## Expected
- Exactly one new order; the cart is empty after ordering
- Back shows an empty cart or a notice, not a filled checkout that can resubmit
- Cleanup: void the order

## Notes
Gap from the 2026-10-29 critical-flow review, third pass (no existing case found by search). Never tested. Related: SBF-036 (double click).
