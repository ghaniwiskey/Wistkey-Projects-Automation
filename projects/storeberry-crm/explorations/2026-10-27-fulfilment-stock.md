---
project: storeberry-crm
env: staging
charter: "Explore the uncovered critical order and stock flows (BUG-009 retest, online order fulfilment to Complete, exchange, staff Add Order, PO receive) with our QA member and orders to find blockers and money/points errors."
date: 2026-10-27
timebox: 45m
status: done
---

## Scope
- In scope: our QA member MEMy001164525 and its orders TXN0126102700004 / TXN0126102700002A, order receipt accept (detail + bulk), Delivery panel (pack, save, dispatch), Exchange / Partial Return, Orders > Add Order (online store via WebPOS), Purchase Order create + partial/full receive at TaiPo.
- Out of scope: card/wallet tenders (Bank Transfer / Cash only), other people's orders (another tester, "test 01" / MEMy001164523, was active on the same "ghani" staff account), transfer ship/receive and replenish approve (not reached in the timebox; the other tester edited and received transfers at 14:48-14:49), settings.

## Coverage notes
- BUG-009 retest: Receipt tab > Accept > OK on TXN0126102700004 -> Processing, payment Complete (no "Whoops"). Bulk Accept Receipt on TXN0126102700002A -> "Completed: 1/1", Processing. Bug set to verified.
- Points: +4 (HKD 49) and +39 (HKD 390) are awarded once, at payment acceptance; dispatch/complete adds nothing.
- Fulfilment (門市自取): Delivery > Pack All > Save ("update successfully") > Dispatch > OK -> Order/Payment/Delivery Status Complete, Completed Date 15:09, Delivered 1. Inventory History DELIVERED -1 Stock Qty at TaiPo. Boundary: Dispatch with nothing packed and Save with parcel qty 5 for a 1-item order both do nothing, no request or message (BUG-018).
- Exchange: Exchange / Partial Return > Storeberry HK opens the POS in an iframe side panel (`iframe.webpos-iframe`, URL `webpos?exchange_txn_key=<order>&store_id=11`). It is invisible to snapshot, so it first looked like nothing happened. Exchange qty is capped at the bought qty. 偈油x10 replacement: $10, Silver -$1.50, credit -$49, refund $40.50; the refund tender dialog has no Bank Transfer / original-method option; choosing Cash completes immediately (no extra Check out). Result: TXN1126102700004 (Complete, Exchange Order, -40.50 Cash), original shows "Exchanged: 1" and is in the Exchanged tab, returned unit +1 at TEST12. Points -5 although the order earned +4 (BUG-017).
- Add Order > Add Online Store Order via WebPOS opens a new POS tab (store_id=1, TaiPo). Member search + add product OK (Silver -$7.35, rounding -$0.05, total $41.60). Shipping is mandatory; address validation OK ("Please input address", "All Delivery info selection should be choose."); method rules shown (到付 min $500, JD $1000-3000). Every Submit fails: POST /webpos/check-shipping 500 -> "Oops... error exist!" (4/4, 門市自取 and Testing) -> no online order can be created (BUG-016).
- Purchase order: Default Supplier, TaiPo, product test 2 x2 @ $10 -> Confirm dialog -> Lot2610270903405b1b Processing. Receive is capped at outstanding qty (3 -> 2, 5 -> 1). Receive 1 -> Partial Received; receive 1 -> Received. Inventory History REPLENISHMENT +1 / +1 at TaiPo linked to the lot.
- Heuristics: boundaries (over-pack, over-receive, over-exchange), interrupted flows (dispatch before pack), money/points reconciliation, cross-module checks (order -> inventory -> loyalty).

## Findings
| # | Type | Summary | Severity | Link |
|---|---|---|---|---|
| 1 | bug | Add Online Store Order via WebPOS: /webpos/check-shipping 500, staff cannot create online orders | critical | bugs/BUG-016-add-online-store-order-via-webpos.md |
| 2 | bug | Exchange deducts -5 points on an order that earned +4 | major | bugs/BUG-017-exchange-takes-back-more-loyalty-points.md |
| 3 | bug | Delivery panel silently ignores Dispatch with nothing packed and Save with qty above ordered | minor | bugs/BUG-018-order-delivery-panel-silently-ignores.md |
| 4 | risk | Web POS cash drawer (localStorage `cashDrawerConfig`) was wiped again during the session (set at 15:1x, gone after the exchange / opening the online-store POS); POS Total then fails silently (BUG-014) | - | - |
| 5 | risk | Exchange refund has no "original payment method" tender; a Bank Transfer order was refunded in Cash | - | - |
| 6 | risk | Exchange refund completes as soon as a tender tile is clicked, with no confirm step | - | - |
| 7 | risk | Bulk action menu typo "Facebook Meseenger" (copy, like BUG-004) | - | - |

## New test ideas
- [x] SCRM-091 Fulfil a paid online pickup order: pack, dispatch and complete (P0)
- [x] SCRM-092 Staff creates an online store order via Add Order (WebPOS) with store pickup (P0)
- [x] SCRM-093 Order delivery panel tells staff why Dispatch or Save is refused (P2)
- [x] Partial exchange (1 of n items) and exchange to a more expensive item (customer pays the difference) (P1) -> case SCRM-128
- [x] Home delivery fulfilment with a waybill / tracking code (ShipAny, SF) once BUG-016 is fixed (P1) -> case SCRM-130
- [x] Transfer ship/receive and replenish approve with our own records (SCRM-028, SCRM-029), not reached today -> case SCRM-028, SCRM-029 (run 2026-10-27)

## Test data left on staging
- TXN0126102700004 Complete + exchange TXN1126102700004 (refund 40.50 Cash); TXN0126102700002A Processing (paid, not dispatched).
- Member MEMy001164525: 638 points.
- PO Lot2610270903405b1b Received (+2 product test 2 at TaiPo).
- Web POS cash drawer HK was selected, then found wiped.

## Test Manager
- Manual run `runs/2026-10-27_1606_staging_manual` (exploratory-2026-10-27-fulfilment): SCRM-075, SCRM-048, SCRM-065, SCRM-091, SCRM-027 pass; SCRM-052 (BUG-017), SCRM-092 (BUG-016), SCRM-093 (BUG-018) fail. BUG-009 verified.

## Evidence
- `2026-10-27-fulfilment-stock/01-accept-dispatch-complete.png`, `02-exchange-complete-points-minus5.png`, `03-add-order-check-shipping-500.png`.
