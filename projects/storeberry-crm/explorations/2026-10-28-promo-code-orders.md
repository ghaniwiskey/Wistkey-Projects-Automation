---
project: storeberry-crm
env: staging
charter: "Explore the uncovered P0 single-use promo code flow (generate, assign, revoke) end to end on a real eShop Bank Transfer order, with order void and stock reconciliation, to find money leaks, reusable codes and stock drift."
date: 2026-10-28
timebox: 35m
status: done
---

## Scope
- In scope: Promotions "Promo Code: Get Y% off with discount code X" with Multiple Promotion Code (quota, Generate, Assign, Revoke, require member assignment), eShop member checkout with the code, CRM order detail, Void, Inventory.
- Out of scope: paid orders/refunds with a code, Web POS with an Online Shop-only code (not reached), other people's data, production.
- eShop half: `projects/storeberry-compare/explorations/2026-10-28-promo-code-orders.md`.

## Coverage notes
- Promotion 662 "Autumn 10% code QA890KA": Online Shop, 2026-10-28 00:00 - 2026-12-31 23:00, Y 10, Multiple, quota 2 -> "active". Start picker blocks past days (today from the current hour).
- View page (file icon, `/promotions/view?pid=`) shows Generate/Revoke/Assign, but the Generate dialog fields are all read-only (risk). Edit page (pencil, `/promotions/edit?pid=`) works.
- Quota: 3 against quota 2 -> "Not enough code quota to generate code"; 2 -> "Success" (QA1pr6iu, QAka7BxS). Raising quota to 3 -> "Edited rule successfully.", Current Stock: 1 (SCRM-107).
- Order: member MEMy001164526 (Silver), product C HKD 600.00. Code -> "Autumn 10% code QA890KA" -60.00, then Silver 15% on the rest -81.00, Total 459.00. Bank Transfer, 門市自取 荔枝角 -> TXN0126102700025. CRM order matches (Basket Discount -141.00, Bank Transfer 459.00); it does not show which code was used (risk). Code row: Used, Txn TXN0126102700025, member. Re-apply -> "Promotion code is invalid, expired or exceed the usage limit" (SCRM-106).
- Stock: C Available 14999915 -> 14999914 after the order, TaiPo column 999970 -> 999969, Stock Qty unchanged. Void (Actions > Void this order > Yes) -> Canceled / Canceled, Available and TaiPo back (SCRM-110). Code stays Used (Q-017).
- Revoke: no confirmation, immediate "Revoked", no undo (risk). Revoked while applied in the cart: re-pricing keeps the discount, Proceed -> "Invalid promotion code.", no order created (checked order list), checkout keeps the code until reload (storeberry-compare BUG-018). Fresh apply refused (SCRM-108). Reproduced with QBgH2nw9.
- Require member assignment: unassigned QC39DgTk refused; Assign MEMy999999999 -> "Target Member Not found"; assigned to MEMy001164526 -> "Assigned", then applies (SCRM-109). Staff Reserved At is UTC while Member Reserved At is HKT (BUG-026, also on QCDupVR9).
- Member eShop "My Promotion Codes" -> 404 (storeberry-compare BUG-019).
- Order numbers: TXN0126102700025 was placed 2026-10-28 06:05 HKT; the date part is the UTC date (risk, may confuse staff searching by date).
- Heuristics: boundaries (quota +1, non-existent member), interrupted flow (revoke while applied, void after order), cross-module reconciliation (CRM promotion -> eShop totals -> CRM order -> inventory), CRUD with confirmation.

## Findings
| # | Type | Summary | Severity | Link |
|---|---|---|---|---|
| 1 | bug | eShop My Promotion Codes page is 404 | major | ../../storeberry-compare/bugs/BUG-019-my-account-my-promotion-codes-opens.md |
| 2 | bug | Checkout keeps a revoked code and its discount until reload | minor | ../../storeberry-compare/bugs/BUG-018-checkout-keeps-a-revoked-promo-code-and.md |
| 3 | bug | Code list mixes time zones (Staff Reserved At 8 h behind) | minor | bugs/BUG-026-promotion-code-list-mixes-time-zones.md |
| 4 | question | Should voiding an order release its single-use code? | - | questions/Q-017-should-a-single-use-promotion-code-be.md |
| 5 | risk | View page offers Generate with read-only fields and no explanation | - | - |
| 6 | risk | Revoke has no confirmation and no undo | - | - |
| 7 | risk | CRM order shows the promotion name but not the code used | - | - |
| 8 | risk | Order number date part is the UTC date | - | - |

## New test ideas
- [x] SCRM-106 single-use code on a real order, Used, reuse refused (P0) - pass
- [x] SCRM-107 generate limited by quota (P1) - pass
- [x] SCRM-108 revoked code refused, also when already applied (P1) - pass
- [x] SCRM-109 member assignment required (P1) - pass
- [x] SCRM-110 void releases reserved stock (P1) - pass
- [x] SCRM-111 code list times consistent (P2) - fails, BUG-026
- [x] SBF-026 / SBF-027 (storeberry-compare) - fail, BUG-018 / BUG-019
- [ ] Code order paid (receipt accepted) then refunded: points earned on the net amount and reversed (P1, writes)
- [ ] Promotion with Applied Shop = Online Shop only is not accepted in Web POS (P1, writes)
- [ ] "Cannot apply with other promotions" code: Silver discount is dropped while the code is applied (P1)
- [ ] Assign one code per member on registration: new member gets exactly one code (P2, writes)

## Knowledge updates
- README: promo code section (edit vs view page, Generate/Assign/Revoke, eShop member, stock columns).
- QA data left: promotion 662 (active until 2026-12-31, member assignment required): QA1pr6iu Used, QAka7BxS and QBgH2nw9 Revoked, QC39DgTk and QCDupVR9 assigned to MEMy001164526. Order TXN0126102700025 Canceled. eShop cart of MEMy001164526 emptied.
