---
id: BUG-015
title: "Reserving an expired eGift silently does nothing"
severity: minor
status: open
env: staging
url: "https://storeberry-flower.stagingl10.storeberry.xyz/egift/detail/9"
updated: 2026-10-27T11:38:01.275Z
found: 2026-10-27T11:38:01.275Z
foundBy: "explorations/2026-10-27-cart-payment-review.md"
tests: [SBF-022]
frequency: always
---
## Summary
Expired eGifts are hidden from /egift but their detail pages still open by URL and show Reserve / Redeem to Cart. Reserve > OK ("20 Points will be deducted...") sends POST /egift/reserve which answers {"result":"FAIL","error_type":"ERROR_SHOW","message":"Gift out of reserve period"}, but the page shows nothing. No points were taken (correct).

## Steps to reproduce
1. Log in as a member
2. Open /egift/detail/8 (Nice meat, reserve period ended 2025-07-30) or /egift/detail/9 (testA)
3. Click Reserve, then OK

## Expected
The message "Gift out of reserve period" is shown, or Reserve is disabled on expired gifts.

## Actual
Dialog closes, no message. Reproduced on gifts 8 and 9.

## Evidence
- Screenshot: ![expired egift](../explorations/2026-10-27-cart-payment-review/11-expired-egift-after-ok.jpg)

## Environment
- Base URL: https://storeberry-flower.stagingl10.storeberry.xyz/egift/detail/9
- Env: staging

## History
- 2026-10-27: filed from explorations/2026-10-27-cart-payment-review.md in the Test Manager app.
