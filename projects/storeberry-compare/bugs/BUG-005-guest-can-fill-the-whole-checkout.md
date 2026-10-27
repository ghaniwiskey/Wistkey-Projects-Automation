---
id: BUG-005
title: "Guest can fill the whole checkout before being told a quota product needs a member"
severity: major
status: open
env: staging
url: "https://storeberry-flower.stagingl10.storeberry.xyz/checkout"
found: 2026-10-27
foundBy: "explorations/2026-10-27-eshop-critical.md"
tests: [SBF-011]
frequency: always
---
## Summary
As a guest, adding "test product EN 1" (a quota product) is allowed and the checkout accepts all guest, shipping and payment details. Only after clicking Proceed to checkout does a modal say "Member is requried for quota product." It does not name the product, and "requried" is misspelled.

## Steps to reproduce
1. As a guest add test product EN 1 (large-red and large-blue) and another product to the cart
2. Open checkout, fill guest details, shipping (門市自取, 荔枝角), Bank Transfer, tick 結帳前同意
3. Click Proceed to checkout

## Expected
The cart/product page tells a guest up front that the item requires login, naming the product; the message is spelled correctly.

## Actual
Warning modal "Member is requried for quota product." after the whole form is filled; no order is created.

## Evidence
- Logged in as a new member, the same cart placed order TXN0126102700002 successfully.

## Environment
- Base URL: https://storeberry-flower.stagingl10.storeberry.xyz/checkout
- Env: staging

## History
- 2026-10-27: filed from explorations/2026-10-27-eshop-critical.md in the Test Manager app.
