---
id: SBF-028
title: "Two prepared checkouts can place orders for the last available unit"
feature: checkout
priority: P0
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-30
---

## Goal
Two prepared checkouts can place separate orders for the same last available unit, with the extra quantity recorded as a pre-order and available stock allowed to become negative.

## Preconditions
- A stock-tracked, non-quota product with Pre-order disabled, exactly 1 available unit in the warehouse serving Online Shop, and zero units elsewhere
- Two independent browser sessions with separate cookies and empty carts

## Data
- Bank Transfer only; store pickup
- Different guest details and unique emails for the two shoppers

## Steps
1. In both sessions, add 1 unit of the same product to the cart.
2. In both sessions, fill all checkout details, select store pickup and Bank Transfer, and accept the terms.
3. Submit session A and wait for its order confirmation.
4. Submit session B from its already-prepared checkout.
5. In the CRM, search orders by the product name and inspect inventory for the order warehouse.
6. Void both test orders and empty both carts.

## Expected
- Both sessions reach order confirmation with different order numbers.
- The CRM shows two orders, each with quantity 1 of the selected product.
- Available quantity may reach -1 with Stock Qty 1 and Pre-order Qty 1; this is accepted even when the product Pre-order setting is disabled.
- After both orders are voided, Available Qty and Stock Qty return to 1, Pre-order Qty returns to 0, and both carts are empty.

## Notes
BUG-023, closed as wont-fix at the user's direction on 2026-10-30. The user reported reproducing the same behavior without near-simultaneous submission and explicitly accepted it. The title, goal, steps and expectations now reflect that decision rather than requiring rejection of the second checkout. User-reported confirmation is not an independently rerun result.

Historical evidence under the former no-overselling expectation:
Gap from the 2026-10-28 coverage review. The CRM order list already showed rows with negative available stock "(-1 / 0)" on 2026-10-27 (risk). Related: BUG-017 (Add To Cart and checkout use different stock totals).
2026-10-28 partial check (one member session, not two customers, so not recorded as a run): product test 2 TaiPo Available 8 in the cart; a Pending transfer of 1 from TaiPo dropped it to 7 -> Proceed refused ("The following item(s) are out of stock/not enough stock now: - product test 2", cart line "Not enough stock"); qty 7 -> order placed, Available 0 (not negative); 1 more -> refused. Void + transfer cancel restored 8. The two-session scenario was subsequently executed on 2026-10-30; see the historical run below.

2026-10-30: failed, BUG-023. One user-approved concurrent run using two isolated Playwright guest contexts (not two tabs sharing cookies). Both checkout submissions succeeded for one available unit; CRM showed two orders and Available -1. Product Pre-order was disabled; one accepted order nevertheless showed Pre-order Qty: 1. Both orders were voided, stock restored to 1, both carts verified empty, and the dedicated QA product was hidden for retention. Evidence and result: runs/2026-10-30_1557_staging_manual; session: explorations/2026-10-30-last-unit-two-contexts.md. Not repeated because approval covered one run only. Temporary interactive Playwright harness, not a reusable spec; automated remains false.
