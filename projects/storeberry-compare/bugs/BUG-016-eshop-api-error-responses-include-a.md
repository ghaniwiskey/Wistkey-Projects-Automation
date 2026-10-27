---
id: BUG-016
title: "eShop API error responses include a full server stack trace with file paths"
severity: major
status: wont-fix
env: staging
url: "https://storeberry-flower.stagingl10.storeberry.xyz/egift/reserve"
updated: 2026-10-27T12:10:50.918Z
found: 2026-10-27T11:38:01.287Z
foundBy: "explorations/2026-10-27-cart-payment-review.md"
tests: []
frequency: always
---
## Summary
The JSON error from POST /egift/reserve (customer-facing) contains a "trace" field with the PHP stack trace: /var/www/staging/wildcard.mystoreberry.staging/stagingapp/app/Http/Controllers/EgiftController.php(156), App\Classes\Helper\PopupApiHelper::fetch(), Laravel vendor paths, etc. This discloses server paths, framework and internal class names to any shopper. Seen on staging; production was not checked (read-only).

## Steps to reproduce
1. Log in as a member
2. Open /egift/detail/9 and click Reserve > OK (or POST /egift/reserve for an expired gift)
3. Read the response body

## Expected
Error responses only contain a user-safe message and code.

## Actual
"trace":"#0 /var/www/staging/wildcard.mystoreberry.staging/stagingapp/app/Http/Controllers/EgiftController.php(156): ..." (full trace). Seen twice.

## Evidence
- Response captured 2026-10-27 19:32 HKT, quoted in explorations/2026-10-27-cart-payment-review.md

## Environment
- Base URL: https://storeberry-flower.stagingl10.storeberry.xyz/egift/reserve
- Env: staging

## History
- 2026-10-27: filed from explorations/2026-10-27-cart-payment-review.md in the Test Manager app.
- 2026-10-27: status open -> wont-fix; Closed by the user as won't fix: the stack trace in eShop API error responses is accepted behavior; SBF-022 no longer checks it.
