---
project: storeberry-crm
env: staging
charter: "Explore the uncovered P0 promotion lifecycle (create, edit, expire, delete a code promotion and use it on the eShop), eShop stock limits, and transfer partial receive / in-transit cancel with boundary values and cross-module reconciliation to find money and stock errors."
date: 2026-10-27
timebox: 60m
status: done
---

## Scope
- In scope: Promotions (Add/Edit/Delete, "Promo Code: Get $Y off upon spending over $X with discount code"), eShop guest cart/checkout promo box, eShop Add To Cart stock limits, Transfer Orders (submit, ship, partial receive, cancel in-transit), Inventory History.
- Out of scope: placing orders with the code, card/wallet payments, other people's promotions and transfers, production.
- eShop half: `projects/storeberry-compare/explorations/2026-10-27-promotions-stock.md`.
- Tool: ego-browser (ego lite 0.6.1.13, guide v2.1.0), task space 1.

## Coverage notes
- Promotion create: empty Save -> toast "The name is required.The start datetime is required." (two messages run together; shop/X/Y/code not listed). Created 661 "QA Promo Code QA1027NQ3T8", Online Shop, X 100 / Y 150: saved active with no warning (Y > X, Q-014). End "2026-11-30 23:59:59" became 23:00:00: picker offers whole hours only (Q-015).
- Edit: X 700 / Y 750 persisted after reopening.
- eShop (guest): product C HKD 700.00 + code -> "Applied", Basket Discount -HKD 700.00 (capped at sub-total, not 750), Total 0.00. Applies at exactly X. C + cake 700.10 -> discount 700.10, Total 0.00 (never negative). Removing C -> discount gone, Total 0.10 (SCRM-099). Cake only + code -> "Current shopping cart does not meet the promotion code conditions" (SCRM-100).
- Expire: end before start typed and saved (BUG-024); list "expired". eShop -> "Promotion code is invalid, expired or exceed the usage limit" (SCRM-101).
- Delete: trash -> "Are you sure to delete this promotion rule?" DELETE/CANCEL; Cancel keeps it; DELETE (user-approved) -> list 44 -> 43. edit?pid=661 afterwards -> bare "500 SERVER ERROR".
- eShop stock: Online Shop is served by Office, TaiPo, IFC Warehouse, 半島倉 (Add Transfer Order warehouse labels). product test 2: Add To Cart limit 52 (= 44+8+0+0; 53 refused, 9 in cart + 60 refused), but checkout flags "Not enough stock" above TaiPo's 8 -> storeberry-compare BUG-017.
- Transfer 311 QA-TO-mvqodhe9 Office -> TaiPo, C x1 + product test 2 x1: Pending (Office test 2 44/44 -> 44/43), Transfer > OK -> In-transit (43/43), only test 2 toggled > Receive > OK -> Partial Received, TaiPo 9/8 -> 10/9, C 0. Only Receive remains (no cancel, Q-016). Received C later -> Received; Receive Time overwritten (BUG-025).
- Transfer 312 QA-TO-mvqoiwwt product test 2 x1: In-transit -> "Cancel Transfer" > OK -> back to **Pending** (stock 43, available 42), Transfer time = cancel time (BUG-025). "Cancel Transfer Orders" > OK -> Canceled, Office 43/43. History: PENDING_TRANSFER, IN_TRANSIT, CANCEL_TRANSFER, CANCEL_TRANSFER_ORDER all linked.
- Heuristics: boundaries (X exactly, X+0.10, below X, Y > X, end < start, qty N/N+1, cumulative adds), interrupted flow (remove items after applying a code, cancel after ship, partial receive), cross-module reconciliation (CRM promotion -> eShop totals; transfer -> inventory -> history), CRUD with confirmation.

## Findings
| # | Type | Summary | Severity | Link |
|---|---|---|---|---|
| 1 | bug | eShop Add To Cart allows online-total stock (52) but checkout says "Not enough stock" above TaiPo stock (8) | major | ../../storeberry-compare/bugs/BUG-017-add-to-cart-accepts-more-than-checkout.md |
| 2 | bug | Promotion saves with End Datetime before Start Datetime | minor | bugs/BUG-024-promotion-saves-with-an-end-datetime.md |
| 3 | bug | Transfer time / Receive Time overwritten by cancel and second receive | minor | bugs/BUG-025-transfer-order-times-are-overwritten.md |
| 4 | question | Promo discount Y > minimum spend X allowed (free orders); does "over X" mean >= X? | - | questions/Q-014-should-a-promo-code-discount-be-allowed.md |
| 5 | question | Promotion end time only in whole hours; typed minutes dropped | - | questions/Q-015-promotion-end-time-can-only-be-set.md |
| 6 | question | No way to cancel the rest of a Partial Received transfer; "Cancel Transfer" only returns to Pending | - | questions/Q-016-how-should-staff-close-the-rest-of.md |
| 7 | risk | Empty promotion Save lists only 2 of the required fields, messages joined without a space | - | - |
| 8 | risk | Deleted promotion edit URL shows raw "500 SERVER ERROR" | - | - |
| 9 | risk | product test 2 data: "original" HKD 100 struck through, "sale" HKD 1,000; the CRM lets sale price exceed original | - | - |

## New test ideas
- [x] SCRM-098 promo code created in CRM discounts a qualifying eShop basket (P0) - pass
- [x] SCRM-099 discount removed when basket drops below minimum (P0) - pass
- [x] SCRM-100 code refused below minimum (P1) - pass
- [x] SCRM-101 expired code refused (P1) - pass
- [x] SCRM-102 end before start rejected (P2) - fails, BUG-024
- [x] SCRM-103 edit and delete a promotion with confirmation (P1) - pass
- [x] SCRM-104 partial receive (P1) - pass
- [x] SCRM-105 cancel in-transit returns stock (P1) - stock pass, time fails BUG-025
- [x] SBF-024 / SBF-025 eShop stock limits (storeberry-compare)
- [x] Place a Bank Transfer order with a minimum-spend code, then void it: discount and order total in CRM match the checkout (P0, writes) -> case SCRM-106, SCRM-110
- [x] Promotion with Applied Shop = Online Shop only is not applied in Web POS (P1, writes) -> case SCRM-114
- [x] Member-only / level-restricted code refused for a guest (P1) -> case SBF-032

## Knowledge updates
- README: promotions and transfer notes (see "Promotions, stock limits, transfers").
- ego-browser: `page.screenshot()` takes no `type` option and fails while the ego window is minimized; snapshot scope is `full_page | only_within_viewport | subtree`. eShop pages often never reach `load`; navigate with `waitUntil: "commit"` and wait for a selector.
- QA data left: transfers 311 (Received) and 312 (Canceled); product test 2 +1 at TaiPo / -1 at Office; C +1 at TaiPo. Promotion 661 deleted; guest cart emptied.
