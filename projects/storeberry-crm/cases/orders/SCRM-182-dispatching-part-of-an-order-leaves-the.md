---
id: SCRM-182
title: "Dispatching part of an order leaves the remaining quantity unfulfilled"
feature: orders
priority: P1
tags: [regression, writes, final]
envs: [staging]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Fulfil one order in two dispatches

Verify that the first partial dispatch ships only the packed quantity and the order completes only after the remaining quantity is dispatched.

## Preconditions
- A QA member and a staff account with receipt acceptance, packing and dispatch permissions are available.
- A stock-tracked, non-quota QA product has at least 2 available units.
- A clearly marked test receipt image is available.

## Data
- Bank Transfer and store pickup only.
- Order remark: Partial dispatch <unique>.

## Steps
1. Log in to the eShop as the QA member and place a pickup order for 2 units of the selected product with the unique remark. Upload the marked test receipt.
2. Log in to the CRM as staff and accept the receipt for this order. Note its ordered quantity and physical Stock Qty before dispatch.
3. Open Delivery, pack only 1 unit, save and dispatch that packed unit.
4. Reload the order, member delivery information and inventory history. Note delivered and pending quantities.
5. Pack and dispatch the remaining 1 unit, then reload the same views.
6. Refund this test order after verification and reconcile its cleanup movements.

## Expected
- After the first dispatch, Delivered is 1 and the remaining quantity 1 is still pending; the order is not Complete.
- The first dispatch deducts only 1 unit from physical stock and is attributable to this order in inventory history.
- After the second dispatch, Delivered is 2, pending quantity is 0 and the order is Complete.
- Total physical stock deduction for both dispatches is 2 units, not an extra deduction of the full order quantity on the second dispatch.

## Notes
Proposed gap, not executed. SCRM-091 uses Pack All and one dispatch; SCRM-130 checks courier tracking. Neither verifies quantity and completion across two dispatches. The delivery panel supports packed quantities (SCRM-093), but this flow has not been exercised. Use only an independently prepared QA order and obtain explicit approval for receipt acceptance, both dispatches and refund cleanup for each run; no automatic retries.
