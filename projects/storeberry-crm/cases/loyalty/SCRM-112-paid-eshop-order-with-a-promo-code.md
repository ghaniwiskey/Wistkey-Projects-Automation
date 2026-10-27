---
id: SCRM-112
title: "Paid eShop order with a promo code earns points on the net total, and a full refund reverses points, level spending and stock"
feature: loyalty
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Loyalty points and member level spending follow the money actually paid, and a refund takes them back.

## Preconditions
- Staging CRM login; a QA promotion "Promo Code: Get Y% off with discount code X", Applied Shop Online Shop, Multiple Promotion Code with a code assigned to the QA member (e.g. 662)
- Earn rule read from Loyalty Setting > Point Policy (2026-10-28: $100 earns 10 points, calculated by percentage)

## Data
- Bank Transfer only; a receipt image

## Steps
1. eShop My Account: note Membership Points and Member level spending; CRM Inventory: note the product's Available Qty
2. Place a Bank Transfer order with the code (pickup) and upload a receipt from the order's Upload Receipt tab
3. CRM order > Receipt > comment > Accept > OK
4. Reread points, level spending and Point History
5. CRM order > Actions > Refund this order > Original Payment Method > Refund > Yes
6. Reread points, level spending, inventory and the code row

## Expected
- Step 3: Order Status Processing, Payment Status Complete, outstanding $0.00
- Step 4: points + floor(net total x 10%) with "Point Earned / Order no."; level spending + net total (after code and member discounts)
- Step 6: Order and Payment Status Refunded; "Refund - Transaction" takes the same points back; level spending back to step 1
- Step 6: Available Qty back to step 1

## Notes
2026-10-28 manual: pass. TXN0126102700026 (C 600 - code 60 - Silver 81 = 459): +45 points (660 -> 705), spending 717 -> 1176; refund -> -45 (660), spending 717, C Available 14999915. Code QC39DgTk stays Used after the refund (Q-017). The refund point row has no order number and the order Payment History shows no refund line (risks).
