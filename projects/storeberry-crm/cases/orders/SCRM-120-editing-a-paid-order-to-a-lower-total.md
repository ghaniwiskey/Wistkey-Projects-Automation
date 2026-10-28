---
id: SCRM-120
title: "Editing a paid order to a lower total records the difference as a refund and adjusts the points"
feature: orders
priority: P0
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
When staff remove something from a paid order, the customer is not overcharged and points follow the new amount.

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
- Step 2: the POS shows the amount already paid and the difference to give back (no negative "Balance due" without explanation)
- Step 3: replacement order total = original minus the removed line (after discounts); paid status Complete; the difference appears as a refund line (or a clear outstanding credit)
- Step 3: original order Canceled with a link to the replacement; payments are not counted twice in Payment History
- Step 4: points and level spending reflect only the replacement total

## Notes
2026-10-28 manual: fail, BUG-027. POS asked for the full 510.00 (Total Paid 0), tender "Bank Transfer (已付Paid: 894) $510.00"; 006A Pending Payment with 510.00 outstanding, 006 Canceled with no refund, points voided (TXN0126102800006 -> 006A).

Never tested before (2026-10-28 review). On 2026-10-27 an unpaid edit showed "Balance due $ -390.00" (BUG-010 evidence) and the paid/unpaid outcome is Q-011.
