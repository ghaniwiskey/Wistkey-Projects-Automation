---
id: SBF-047
title: "Switching the eShop language keeps the cart and the checkout details"
feature: checkout
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Customers switching between English and Chinese do not lose their cart or entered details.

## Preconditions
- Logged-in QA member, cart empty

## Data
- A non-quota product found at runtime

## Steps
1. Add the product in English, open checkout and fill the pickup details
2. Switch to 中文
3. Switch back to English

## Expected
- Cart, quantities, totals and entered details are unchanged after each switch
- Product names, buttons and messages are translated (no mixed or missing labels)
- Cleanup: empty the cart

## Notes
Gap from the 2026-10-29 critical-flow review, second pass (no existing case found by search). Never tested.
