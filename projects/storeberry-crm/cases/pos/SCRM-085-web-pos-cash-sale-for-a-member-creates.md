---
id: SCRM-085
title: "Web POS cash sale for a member creates a completed order and earns points"
feature: pos
priority: P0
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
An in-store POS sale with Cash records a completed offline order on the member, with payment and loyalty points.

## Preconditions
- Staging CRM login
- Active store with Web POS (e.g. Storeberry HK) and a cash drawer selectable in POS Settings > Cash In Out
- A QA member and a product in stock in the store warehouse

## Data
- Store, product and member chosen at runtime; Cash is the only tender (user approval 2026-10-27)

## Steps
1. Physical Stores POS > Use (store) and select the cash drawer in Settings > Cash In Out
2. Add the product, select the QA member, click Total
3. Choose Cash, enter the exact amount, Submit, CHECK OUT
4. Note order number, points added and points balance on the Complete dialog, click Done
5. Open the order in the CRM and the member Point History

## Expected
- Complete dialog shows an order number (TXN11...) with total, change 0 and points added
- CRM order: Status Complete, Channel OFFLINE, Store and Warehouse of the POS, Payment History Cash with the paid amount, Delivery Status Complete
- Point History has a Point Earned line for the order and the balance matches the Complete dialog

## Notes
Explored 2026-10-27 (TXN1126102700001). A first purchase also triggered a +100 Upgrade Reward (balance 500 + 1 + 100 = 601).
