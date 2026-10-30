---
id: SBF-028
title: "Only one of two customers can buy the last unit of a product"
feature: checkout
priority: P0
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-30
---

## Goal
The eShop never sells more units than are available, even when two carts hold the last one.

## Preconditions
- A non-quota product whose stock in the warehouse serving Online Shop (TaiPo, see Q-009) is small, found at runtime in CRM Inventory; if none, create it with a transfer of 1 unit to TaiPo (SCRM-028) and note the product (available = 1 for the test)
- Two independent browser sessions with separate cookies and empty carts (two guests, or a member and a guest)

## Data
- Bank Transfer (fn-bank-transfer) only; store pickup

## Steps
1. Session A and session B each add 1 unit of the product to the cart -> Expect: both get "Item added successfully"
2. Both open /checkout and fill the details up to Proceed to checkout
3. Session A clicks Proceed to checkout
4. Session B clicks Proceed to checkout immediately, without waiting for session A to finish
5. CRM: read the product row in Inventory and the order list

## Expected
- Steps 3–4: exactly one session reaches a thank-you page with an order number
- Steps 3–4: the other session is refused with a message that the product is out of stock / not enough stock; no second order is created
- Step 5: exactly one new order; Available for the warehouse is 0, never negative
- Cleanup: void the order (stock returns to 1) and empty both carts

## Notes
Gap from the 2026-10-28 coverage review. The CRM order list already showed rows with negative available stock "(-1 / 0)" on 2026-10-27 (risk). Related: BUG-017 (Add To Cart and checkout use different stock totals).
2026-10-28 partial check (one member session, not two customers, so not recorded as a run): product test 2 TaiPo Available 8 in the cart; a Pending transfer of 1 from TaiPo dropped it to 7 -> Proceed refused ("The following item(s) are out of stock/not enough stock now: - product test 2", cart line "Not enough stock"); qty 7 -> order placed, Available 0 (not negative); 1 more -> refused. Void + transfer cancel restored 8. Still open: two sessions proceeding at the same moment.

2026-10-30: failed, BUG-023. One user-approved concurrent run using two isolated Playwright guest contexts (not two tabs sharing cookies). Both checkout submissions succeeded for one available unit; CRM showed two orders and Available -1. Product Pre-order was disabled; one accepted order nevertheless showed Pre-order Qty: 1. Both orders were voided, stock restored to 1, both carts verified empty, and the dedicated QA product was hidden for retention. Evidence and result: runs/2026-10-30_1557_staging_manual; session: explorations/2026-10-30-last-unit-two-contexts.md. Not repeated because approval covered one run only. Temporary interactive Playwright harness, not a reusable spec; automated remains false.
