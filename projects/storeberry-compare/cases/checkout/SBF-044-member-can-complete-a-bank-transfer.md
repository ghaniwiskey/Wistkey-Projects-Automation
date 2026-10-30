---
id: SBF-044
title: "Member can complete a bank transfer checkout on a phone-sized screen"
feature: checkout
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-30
---

## Goal
The main purchase journey works on mobile, where most shop customers are.

## Preconditions
- Viewport 390x844 or browsers: [mobile]
- Logged-in QA member, cart empty

## Data
- A non-quota product with positive weight, found at runtime, so shipping and store-pickup fields are offered
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
Gap from the 2026-10-29 critical-flow review, second pass (no existing case found by search). Passed on 2026-10-30 in runs/2026-10-30_1643_staging_manual. Aside browser viewport 390x844 (not a physical-device or touch-emulation run): existing QA member MEMy001164526, C x1, Bank Transfer, pickup at 荔枝角. Order TXN0126103000013 (CRM 11068), HKD 600, was confirmed; the clearly marked test receipt uploaded from My Orders and Payment Review was confirmed in both member order details and CRM. The order was then voided and Canceled verified in both views; cart 0. Document/body width stayed 375 CSS px within the 390 CSS px viewport; required fields and Proceed button stayed within horizontal bounds. No blocking popup appeared. One approved execution, no retry. Evidence and coverage notes: explorations/2026-10-30-mobile-checkout.md.
