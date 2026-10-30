---
id: SBF-068
title: "Retrying after a lost checkout confirmation does not create a second order"
feature: checkout
priority: P0
tags: [regression, writes, final]
envs: [staging]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Order saved but checkout confirmation lost

Verify that losing the confirmation after the server saves an order does not create another order when the shopper retries.

## Preconditions
- A QA member and a staff account that can inspect that member’s test orders are available.
- A test browser or proxy can withhold the checkout response after the server has accepted and saved the order.
- A stock-tracked non-quota product is available.

## Data
- Bank Transfer and store pickup only.
- Order remark: Lost confirmation <unique>.

## Steps
1. Log in to the eShop as the QA member and prepare checkout with the unique remark.
2. Submit checkout and withhold its successful response before the shopper receives the confirmation.
3. Log in to the CRM as staff and confirm that exactly one test order has already been saved before allowing the shopper to retry.
4. Restore the connection and use the shopper’s available retry or Proceed action once.
5. Inspect My Orders, the CRM order list and inventory movements for the unique remark.
6. Void every order created by this test and empty the cart.

## Expected
- The original saved order remains visible in My Orders and the CRM.
- After the retry, exactly one order exists for this checkout attempt; no second order or second stock reservation is created.
- The order contents, payment amount and stock reservation agree across the member and staff views.

## Notes
Proposed gap, not executed. Distinct from SBF-050: this scenario proves that the server already saved an order before the response is lost. SBF-050 covers failed checkout requests; SBF-036 covers double-clicks and SBF-049 covers navigation after a received thank-you page. One explicitly approved scenario includes the initial submission, one controlled retry and cleanup; do not repeat it automatically.
