---
id: SCRM-120
title: "Editing a paid order to a lower total creates a Pending Payment replacement for the new total"
feature: orders
priority: P0
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-30
---

## Goal
Documents the accepted behavior when staff remove something from a paid order: the payment is not carried over to the replacement order.

## Preconditions
- A QA member's eShop order paid by Bank Transfer with the receipt accepted (Processing / Complete), placed during the test, two units of one product (or two products)
- Order detail > Actions > Edit this order opens the Web POS and, on CHECK OUT, cancels the original and creates a replacement order "<number>A" (README; BUG-010)
- Member points and level spending noted from My Account

## Data
- Bank Transfer only; Cash only if the POS asks for a tender

## Steps
1. Note the original order total, Payment History and member points
2. Edit this order > Use order creation date, reduce one line by 1, Total, finish the POS flow
3. Open the replacement order and the original order in the CRM
4. Reread member points, level spending and Point History

## Expected
- Step 3: replacement order total = original minus the removed line (after discounts); status Pending Payment with Outstanding balance = that total
- Step 3: original order Canceled; its Payment History still shows the original payment and there is no refund line
- Step 4: the original order points are voided and the replacement earns none until it is paid

## Notes
2026-10-28 run: TXN0126102800006 -> 006A (POS asked for the full 510.00, 006A Pending Payment 510.00, 006 Canceled with no refund, points voided). BUG-027, closed as wont-fix (accepted behavior): editing a paid order discards the payment. Paid/unpaid outcome background: Q-011.
