---
id: SBF-050
title: "A server or network error at Proceed to checkout tells the customer and creates no order"
feature: checkout
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Failures during order placement are visible and safe to retry.

## Preconditions
- Logged-in QA member; automation can fail the order request with page.route()

## Data
- A non-quota product found at runtime
- Bank Transfer (fn-bank-transfer)

## Steps
1. Fill checkout and make the order request fail (500, then offline)
2. Read the page
3. Restore the network and Proceed again

## Expected
- Step 2: a clear error message, the cart and details are kept, no stack trace shown (BUG-016 accepted for API bodies only)
- Step 3: exactly one order is created
- Cleanup: void the order

## Notes
Gap from the 2026-10-29 critical-flow review, third pass (no existing case found by search). Never tested.
