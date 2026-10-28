---
project: storeberry-crm
env: staging
charter: "Explore changes to paid eShop orders (partial return, edit to a lower and a higher total) on real Bank Transfer orders with accepted receipts, reconciling refunds, points, level spending and stock, to find money leaks."
date: 2026-10-28
timebox: 30m
status: done
---

## Scope
- In scope: never-run P0 cases SCRM-117, SCRM-120, SCRM-121; eShop member checkout (MEMy001164526), receipt upload and CRM Accept, Exchange / Partial Return (POS iframe, store Online Shop), Edit this order, Point History, level spending (eShop My Account and CRM customer profile), Inventory.
- Out of scope: SCRM-116 (needs a store that sells from an Online Shop warehouse: on 2026-10-27 none did, so it needs a store/warehouse mapping change, which needs the user's OK), SCRM-069/070 (card gateways not allowed), production.

## Coverage notes
- Baseline: member Level 2, spending 717.00, 660 points. C (SKU CCCCC) Available 14,999,915 (TaiPo 999,970); product test 2 Available 68 (TaiPo 9).
- TXN0126102800001: C 600 + product test 2 1,000, basket 全單買滿$1000減$300, Total 1,300.00 (no Silver discount with the basket promo). Accept -> +130 points, spending 2,017 -> Level 3 ($17.00 / $3,000).
- Actions > Refund this order is full-refund only (1,300.00, no item choice). Exchange / Partial Return appears once the order is paid; it asks for the store, then opens the POS in `iframe.webpos-iframe`. Item shares are prorated on the paid total (C 487.50, product test 2 812.50). Step 2 pops a Shipping dialog: Cancel works. Refund -> refund order TXN0126102800002 (-487.50, linked). Original keeps Total 1,300.00, line "Exchanged: 1", Status History "Exchange". Points -49 (keeps 81 = 10% of 812.50, right). Stock right. Level spending 1,042.00 instead of 1,529.50, member back to Level 2 (BUG-028, SCRM-134 / Q-001).
- Repro without a level change: TXN0126102800003 C + NAKAJIMA cake 0.10, Silver -90.01, rounding -0.09, Total 510.00; spending 1,552.00, +51 (right). Return C (share 509.92): Rounding -0.08, refund 510.00 (TXN0126102800004), spending 532.00 (-2 x 510). Return the cake (share 0.08): refund 0.10 (TXN0126102800005), spending 531.80. Order refunded 510.10 of 510.00 paid (BUG-029, BUG-028 x3).
- After picking Bank Transfer in the refund dialog, two of three returns finished with no CHECK OUT ("Please wait..." then Complete): SCRM-133.
- Edit this order on paid TXN0126102800006 (C x2, buy 2 6off + basket, 894.00, +89 points): reduce to 1 -> 510.00; payment step Total Paid 0, Balance due $ -510.00; Bank Transfer fills "(已付Paid: 894) $510.00"; CHECK OUT > OK -> 006A Pending Payment, Outstanding 510.00; 006 Canceled with 894 still in its Payment History and no refund; Void -89, nothing earned (BUG-027).
- Edit up on paid TXN0126102800007 (C x1, 510.00): raise to 2 -> 894.00, "There are gifts not selected" > OK, Balance due $ -894.00; 007A Pending Payment, Outstanding 894.00; eShop shows 007A Pending Payment 894.00 with Upload Receipt / Resume Payment (BUG-027). Warehouse TaiPo kept (original was TaiPo).
- Heuristics: follow the money (paid total -> refunds -> points -> level spending), boundaries (rounding on tiny shares, refund after full refund), interrupted/changed orders, cross-module reconciliation (eShop, CRM order, POS, loyalty, inventory).

## Findings
| # | Type | Summary | Severity | Link |
|---|---|---|---|---|
| 1 | bug | Editing a paid order discards the payment: replacement Pending Payment for its full total, no refund of the difference | critical | bugs/BUG-027-editing-a-paid-order-discards-the.md |
| 2 | bug | Partial return deducts level spending twice the refund | major | bugs/BUG-028-exchange-partial-return-deducts-member.md |
| 3 | bug | Partial return rounds the refund down (more refunded than the share, refunds above the amount paid) | major | bugs/BUG-029-partial-return-refund-rounds-the.md |
| 4 | risk | Picking a refund method can complete the refund without CHECK OUT | - | cases/orders/SCRM-133-choosing-a-refund-method-does-not.md |
| 5 | risk | Partial return after a level upgrade downgrades the member (rule open in Q-001) | - | cases/loyalty/SCRM-134-partial-return-after-a-level-upgrade.md |
| 6 | risk | Exchange returns show in Point History as "Point Earned" with negative points (full refunds say "Refund - Transaction"); the refund order line is a generic "退款 Refund" placeholder | - | - |
| 7 | risk | eShop product test 2 shows HKD 100.00 crossed out and HKD 1,000.00 as the price (sale price above regular); POS lists it at HKD 49.00. Likely test data | - | - |

## Test cases written
- SCRM-132 Partial returns never refund more than the item share, refunds never exceed the amount paid (P1) - fail, BUG-029
- SCRM-133 Choosing a refund method does not finish the refund before CHECK OUT (P2) - not run as a case (risk)
- SCRM-134 Partial return after a level upgrade re-evaluates level and spending (P1, Q-001) - not recorded, waits on Q-001
- Updated: SCRM-117 (actual flow and level spending), SCRM-120, SCRM-121 (results).

## Knowledge and data
- context.md: Orders, payments and fulfilment (partial return flow, edit of paid orders).
- QA data left (member MEMy001164526; its level spending is now wrong because of BUG-028 / BUG-027: 531.80 instead of about 1,529.40): TXN0126102800001 Processing (product test 2 still to fulfil, C returned via 002), 002/004/005 refund orders, 003 Processing (both items returned), 006 and 007 Canceled, 006A and 007A Pending Payment (void them to release 1 + 2 C if needed).
