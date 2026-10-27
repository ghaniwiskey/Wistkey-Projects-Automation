---
project: storeberry-compare
env: staging
charter: "Explore guest checkout with a CRM-created minimum-spend promo code and eShop stock limits at the boundaries to find wrong totals and oversell."
date: 2026-10-27
timebox: 30m
status: done
---

## Scope
- In scope: guest cart, checkout promo box, Add To Cart quantity limits for product test 2.
- Out of scope: placing orders, member pricing, card/wallet payments.
- CRM half: `projects/storeberry-crm/explorations/2026-10-27-promotions-transfers.md`.

## Coverage notes
- Promo code QA1027NQ3T8 (CRM promotion 661, X 700 / Y 750): applies at exactly 700.00 and at 700.10; discount capped at the sub-total (Total HKD $0.00, never negative). Removing the qualifying item drops the discount. Below the minimum: "Current shopping cart does not meet the promotion code conditions". Expired: "Promotion code is invalid, expired or exceed the usage limit".
- Stock (product test 2): Add To Cart limit equals the Online Shop warehouses' total (52 ok, 53 "Not enough quantity for this product"); cumulative adds are checked (9 + 60 refused). Checkout line shows "Not enough stock" for anything above TaiPo's 8 -> BUG-017.
- Heuristics: boundaries (X, X+0.10, below X; N, N+1), interrupted flow (remove item after applying a code), cross-module (CRM stock -> eShop limits).

## Findings
| # | Type | Summary | Severity | Link |
|---|---|---|---|---|
| 1 | bug | Add To Cart accepts more stock than checkout allows | major | bugs/BUG-017-add-to-cart-accepts-more-than-checkout.md |
| 2 | risk | product test 2 shows a struck-through "original" HKD 100 and a "sale" HKD 1,000; the cart charges 1,000 (consistent, but the price data is reversed) | - | - |

## New test ideas
- [x] SBF-024 Add To Cart refuses quantity above online stock (P1) - pass
- [x] SBF-025 checkout accepts what Add To Cart accepted (P1) - fails, BUG-017

## Knowledge updates
- README: stock-limit note; cart trash icon is `i.fa-trash-o` (no accessible name); checkout promo input `#promotion_code` + APPLY.
