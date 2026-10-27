---
id: BUG-010
title: "Proceed to checkout does nothing when a required shipping field is missing"
severity: minor
status: wont-fix
env: staging
url: "https://storeberry-flower.stagingl10.storeberry.xyz/checkout"
updated: 2026-10-27T09:08:00.376Z
found: 2026-10-27
foundBy: "explorations/2026-10-27-eshop-critical.md"
tests: []
frequency: always
---
## Summary
With a weighted item in the cart and no Shipping Method selected, ticking 結帳前同意 and clicking Proceed to checkout leaves the page unchanged with no message or field highlight. Also, adding an address in My Address Book gives no confirmation message.

## Steps to reproduce
1. As a member, add product test 2 to the cart and open checkout
2. Leave Shipping Method on "-- Select --", select Bank Transfer, tick 結帳前同意
3. Click Proceed to checkout

## Expected
The missing field is highlighted with a message such as "Please select a shipping method".

## Actual
Nothing happens; the user is not told what is missing. After choosing 門市自取 + pickup store the order (TXN0126102700004) was placed.

## Evidence
- Observed 2026-10-27.

## Environment
- Base URL: https://storeberry-flower.stagingl10.storeberry.xyz/checkout
- Env: staging

## History
- 2026-10-27: filed from explorations/2026-10-27-eshop-critical.md in the Test Manager app.
- 2026-10-27: status open -> wont-fix.
- 2026-10-27: no linked cases; nothing to update.
