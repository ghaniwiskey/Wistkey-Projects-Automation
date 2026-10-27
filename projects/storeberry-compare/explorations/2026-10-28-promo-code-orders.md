---
project: storeberry-compare
env: staging
charter: "Explore member checkout with CRM single-use promo codes (apply, reuse, revoked while applied, assignment) and the member's promotion code page to find wrong totals and dead ends."
date: 2026-10-28
timebox: 20m
status: done
---

## Scope
- In scope: member checkout (MEMy001164526) promo box, Bank Transfer order with a code, My Account > My Promotion Codes.
- Out of scope: guest checkout, card/wallet payments.
- CRM half: `projects/storeberry-crm/explorations/2026-10-28-promo-code-orders.md`.

## Coverage notes
- The browser was already logged in as QA member MEMy001164526 (Level 2 / Silver 15%); `/cart` redirects to `/checkout`.
- Code QA1pr6iu: Applied; code discount (10%) is taken first, Silver 15% on the rest; order TXN0126102700025 placed (Bank Transfer, 門市自取 needs Address + store radio). Reuse refused with "Promotion code is invalid, expired or exceed the usage limit".
- Revoked while applied: changing Shipping Method keeps the discount; Proceed shows a modal "Warning / Invalid promotion code." and no order is made; the summary keeps the revoked code until reload (BUG-018, twice).
- Unassigned code (member assignment required): refused. Assigned: applied.
- My Account > My Promotion Codes -> `/my-account/promotion-codes` 404 (BUG-019, twice).

## Findings
| # | Type | Summary | Severity | Link |
|---|---|---|---|---|
| 1 | bug | My Promotion Codes page is 404 | major | bugs/BUG-019-my-account-my-promotion-codes-opens.md |
| 2 | bug | Checkout keeps a revoked code and its discount until reload | minor | bugs/BUG-018-checkout-keeps-a-revoked-promo-code-and.md |

## New test ideas
- [x] SBF-026 checkout drops a code that became invalid (P2) - fails, BUG-018
- [x] SBF-027 My Promotion Codes lists assigned codes (P1) - fails, BUG-019

## Knowledge updates
- README: member promo code notes.
