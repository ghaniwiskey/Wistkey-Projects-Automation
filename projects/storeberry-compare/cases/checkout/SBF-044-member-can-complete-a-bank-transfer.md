---
id: SBF-044
title: "Member can complete a bank transfer checkout on a phone-sized screen"
feature: checkout
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
The main purchase journey works on mobile, where most shop customers are.

## Preconditions
- Viewport 390x844 or browsers: [mobile]
- Logged-in QA member, cart empty

## Data
- A non-quota product found at runtime
- Bank Transfer (fn-bank-transfer), store pickup

## Steps
1. Search for the product and add it to the cart
2. Open checkout, fill pickup details, select Bank Transfer and tick 結帳前同意
3. Dismiss popups and Proceed to checkout
4. Upload a receipt from My Orders

## Expected
- Every button, popup close icon and field is visible and tappable without horizontal scrolling
- Step 3: thank-you page with an order number
- Step 4: Payment Review status
- Cleanup: void the order

## Notes
Gap from the 2026-10-29 critical-flow review, second pass (no existing case found by search). Never tested.
