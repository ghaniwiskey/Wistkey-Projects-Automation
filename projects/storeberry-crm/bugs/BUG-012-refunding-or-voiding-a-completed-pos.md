---
id: BUG-012
title: "Refunding or voiding a completed POS sale resets Delivery Status from Complete to Pending"
severity: major
status: open
env: staging
url: "https://www.stagingl10.storeberry.xyz/orders/detail?id=10973"
found: 2026-10-27
foundBy: "explorations/2026-10-27-pos-order-lifecycle.md"
tests: [SCRM-086, SCRM-087]
frequency: always
---
## Summary
A walk-in POS sale is created with Delivery Status Complete. After Refund this order or Void this order, the original order shows Delivery Status Pending and a Delivery link appears; the refund order is also Pending. Refunded/canceled walk-in sales can therefore show up as orders still to be delivered.

## Steps to reproduce
1. Web POS (Storeberry HK): sell 1 x 偈油x10 to a QA member, Cash, CHECK OUT
2. CRM order detail: Delivery Status Complete
3. Actions > Refund this order > Original Payment Method > Refund > Yes (or Actions > Void this order > Yes)
4. Read Delivery Status

## Expected
Delivery Status stays Complete (goods were handed over at the counter); only order/payment status change.

## Actual
Delivery Status Pending on TXN1126102700001 (refunded, refund order TXN1126102700001R also Pending) and on TXN1126102700002 (voided).

## Evidence
- Screenshot: ![refund](../explorations/2026-10-27-pos-order-lifecycle/02-refunded-pos-order-delivery-pending.png)
- Screenshot: ![void](../explorations/2026-10-27-pos-order-lifecycle/03-voided-pos-order-delivery-pending.png)

## Environment
- Base URL: https://www.stagingl10.storeberry.xyz/orders/detail?id=10973
- Env: staging

## History
- 2026-10-27: filed from explorations/2026-10-27-pos-order-lifecycle.md in the Test Manager app.
