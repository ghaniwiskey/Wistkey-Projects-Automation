---
project: storeberry-crm
env: staging
charter: "Explore the not-yet-covered money and order-lifecycle flows (Web POS cash sale, refund, void, actions on unpaid orders, cancel of an online order) with QA data to find high-impact defects."
date: 2026-10-27
timebox: 50m
status: done
---

## Scope
- In scope: Web POS (Storeberry HK, warehouse TEST12) cash sales to QA member MEMy001164525, refund and void of those sales, loyalty points, Actions on an unpaid guest order (refund, void), status history, stock release.
- Out of scope: card/wallet/QFPay tenders (user allowed Cash only for POS, 2026-10-27), other people's orders (TXN0126102700001 and TXN0126102700005 were not ours, untouched), settings and staff mapping.
- eShop half: `projects/storeberry-compare/explorations/2026-10-27-guest-order-recovery.md`.

## Coverage notes
- Web POS has no accessibility tree (snapshot is empty); drive it with DOM text (`element.click()`), Vuetify classes (`button.remove-item-btn`, `.swal2-popup button`) and CSS-pixel coordinates (screenshots are ~1.25x).
- Cash drawer: POS warns "Pleas select a cash drawer in setting page first!" on load; the selection lives only in localStorage `cashDrawerConfig` (Settings > Cash In Out > HK). Without it Total silently does nothing -> BUG-014. The selection vanished once mid-session (cause not found; not reproduced by visiting CRM pages).
- POS stock: product test 2 is out of stock in TEST12 ("out of stock/not enough stock now" with Back/Continue, Continue would oversell). 偈油x10 is not stock-tracked and is a quota product (POS demands a customer; eShop guests are refused).
- Sale 1: TXN1126102700001, HKD 10 Cash, Complete/OFFLINE, +1 point. Point History: 500 + 1 (Point Earned) + 100 (Upgrade Reward) = 601.
- Refund (Actions > Refund this order > Original Payment Method): Refunded, refund order TXN1126102700001R Cash -10.00, Point History "Refund - Transaction -1" (600). Delivery Status Complete -> Pending (BUG-012). The +100 Upgrade Reward and the new Silver tier stayed.
- Sale 2: the member now gets "Silver -$1.50" (15%) automatically. TXN1126102700002 HKD 8.50 Cash, 0 points. Void -> Canceled, Delivery Status Complete -> Pending again (BUG-012); Payment History still shows only +8.50 Cash.
- Unpaid guest order TXN0126102700006 (Pending Payment, Bank Transfer): Actions = Re-order, Edit this order, Change Delivery Warehouse, Refund this order, Void this order (no "Cancel"). Refund offered for $0.10 never paid; confirm does nothing, no message, twice (BUG-013). Void -> Canceled, Status History "Canceled by ghani 12:22", inventory history VOID +1 Available, eShop tracking shows CANCELED.
- CRM shows Customer Name/Email "N/A" for the guest order; the guest's name/email only appear under Delivery > Recipients.
- Refund panel tender tiles and many POS controls have no accessible name.

## Findings
| # | Type | Summary | Severity | Link |
|---|---|---|---|---|
| 1 | bug | Refund or void of a completed POS sale resets Delivery Status Complete -> Pending | major | bugs/BUG-012-refunding-or-voiding-a-completed-pos.md |
| 2 | bug | Refund this order offered on an unpaid order; confirm silently does nothing | minor | bugs/BUG-013-refund-this-order-is-offered-on-an.md |
| 3 | bug | Web POS Total silently does nothing without a cash drawer (console only, typo "Pleas") | minor | bugs/BUG-014-web-pos-total-silently-does-nothing.md |
| 4 | question | Upgrade Reward (+100 points) and Silver tier (15% off) earned by a sale stay after that sale is fully refunded. Intended? | - | - |
| 5 | question | Voiding a paid Cash POS sale adds no reversal to Payment History. How is the cash drawer reconciled? | - | - |
| 6 | question | Guest orders show Customer Name/Email N/A in the CRM header although the guest entered them. Intended? | - | - |
| 7 | risk | POS cash-drawer selection disappeared once (localStorage) and then Total fails silently | - | - |
| 8 | risk | POS lets the cashier Continue with out-of-stock items (oversell) | - | - |
| 9 | risk | Web POS has no accessible roles/names; automation needs DOM selectors | - | - |

## New test ideas
- [x] SCRM-085 Web POS cash sale for a member creates a completed order and earns points (P0)
- [x] SCRM-086 Refund a completed POS cash sale reverses payment and points and keeps fulfilment closed (P0)
- [x] SCRM-087 Void a completed POS sale cancels it and keeps fulfilment closed (P1)
- [x] SCRM-088 POS checkout tells the cashier when no cash drawer is selected (P2)
- [x] SCRM-089 Refund is not offered on an unpaid order (P1)
- [ ] CRM Add Order (admin-created online order) end to end: not explored yet
- [ ] Exchange / Partial Return on a POS sale: not explored yet

## Test data left on staging
- POS orders TXN1126102700001 (Refunded) + TXN1126102700001R, TXN1126102700002 (Canceled), guest order TXN0126102700006 (Canceled). Member MEMy001164525 now 600 points, Silver tier.
- Web POS cash drawer HK selected in this browser's localStorage only.

## Test Manager
- Manual run `runs/2026-10-27_1125_staging_manual` (exploratory-2026-10-27-pos): SCRM-085, SCRM-050, SCRM-051 pass; SCRM-086, SCRM-087 (BUG-012), SCRM-088 (BUG-014), SCRM-089 (BUG-013) fail.

## Evidence
- `2026-10-27-pos-order-lifecycle/01-pos-complete-points-601.png`, `02-refunded-pos-order-delivery-pending.png`, `03-voided-pos-order-delivery-pending.png`, `04-refund-offered-on-unpaid-order.png`, `05-refund-unpaid-no-change.png`.
