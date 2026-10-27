---
id: BUG-019
title: "My Account > My Promotion Codes opens \"Page Not Found\" (404)"
severity: major
status: open
env: staging
url: "https://storeberry-flower.stagingl10.storeberry.xyz/my-account/promotion-codes"
updated: 2026-10-27T22:16:41.484Z
found: 2026-10-27T22:15:45.802Z
foundBy: "explorations/2026-10-28-promo-code-orders.md"
tests: [SBF-027]
frequency: always
---
## Summary
The "My Promotion Codes" link in the member account menu goes to /my-account/promotion-codes, which returns HTTP 404 and the bare "SORRY!!! Page Not Found" page. Members cannot see the promotion codes the shop assigned to them (CRM Promotions > Multiple Promotion Code > Assign), so assigned single-use codes are only usable if the customer learns the code some other way.

## Steps to reproduce
1. Log in to the eShop as a member (MEMy001164526 has two codes of promotion 662 assigned on 2026-10-28)
2. Open My Account and click "My Promotion Codes"

## Expected
A page listing the member's assigned codes (code, promotion, validity, used/unused).

## Actual
URL /my-account/promotion-codes, HTTP 404, "SORRY!!! Page Not Found / Back to Homepage". Reproduced twice (direct URL and menu link).

## Evidence
- Screenshot: ![404](../explorations/2026-10-28-promo-code-orders/06-my-promotion-codes-page-not-found.png)

## Environment
- Base URL: https://storeberry-flower.stagingl10.storeberry.xyz/my-account/promotion-codes
- Env: staging

## History
- 2026-10-28: filed from explorations/2026-10-28-promo-code-orders.md in the Test Manager app.
