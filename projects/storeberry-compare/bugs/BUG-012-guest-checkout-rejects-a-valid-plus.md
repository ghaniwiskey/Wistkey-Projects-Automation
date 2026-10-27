---
id: BUG-012
title: "Guest checkout rejects a valid plus-addressed email with only \"Please fill all required info\""
severity: major
status: open
env: staging
url: "https://storeberry-flower.stagingl10.storeberry.xyz/checkout"
updated: 2026-10-27T09:51:38.840Z
found: 2026-10-27T09:51:38.840Z
foundBy: "explorations/2026-10-27-cart-payment-review.md"
tests: [SBF-019]
frequency: always
---
## Summary
A guest whose email contains "+" (e.g. chan.taiman+abc@example.com, valid per RFC 5322 and common with Gmail) cannot place an order. Proceed to checkout shows the generic dialog "Please fill all required info" and only turns both Email labels red; every field is filled. Replacing the email with one without "+" places the order immediately.

## Steps to reproduce
1. As a guest add NAKAJIMA TAISHODO cake to the cart and open /checkout
2. Fill First Name, Last Name, Contact Number and Email chan.taiman+<unique>@example.com
3. Choose 門市自取, store 荔枝角, an Address, Bank Transfer, tick 結帳前同意
4. Click Proceed to checkout

## Expected
The order is placed (plus addressing is a valid email), or at least the Email field says why it is rejected.

## Actual
Warning dialog "Please fill all required info"; Your Details Email and Shipping Email labels turn red with no text. Reproduced twice. Same form with chan.taiman.<unique>@example.com placed TXN0126102700016.

## Evidence
- Screenshot: ![email plus rejected](../explorations/2026-10-27-cart-payment-review/01-guest-email-plus-rejected.jpg)

## Environment
- Base URL: https://storeberry-flower.stagingl10.storeberry.xyz/checkout
- Env: staging

## History
- 2026-10-27: filed from explorations/2026-10-27-cart-payment-review.md in the Test Manager app.
