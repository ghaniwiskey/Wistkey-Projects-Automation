---
id: SCRM-098
title: "Minimum-spend promo code created in the CRM discounts an eShop basket that reaches the minimum"
feature: promotions
priority: P0
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
A new "Get $Y off upon spending over $X with discount code" promotion works on the eShop as soon as it is saved.

## Preconditions
- Product C is sold on the eShop at HKD 700.00 (or another product whose price is used as X)

## Data
- Promotion name and code: `<unique>` (e.g. QA1027<unique>)
- X = 700, Y = 50, Applied Shop = Online Shop, start = today 00:00, end = a date next month

## Steps
1. Log in to the staging CRM and open Promotions > Add Promotion > "Promo Code: Get $Y off upon spending over $X with discount code"
2. Fill the data above and Save -> Expect: the list shows the promotion as active with "above 700 can enjoy $50 discount"
3. On the eShop as a guest, add product C (HKD 700.00) to the cart and open checkout
4. Enter the code and click APPLY

## Expected
- "Applied: <code>" with REMOVE is shown
- Summary: Sub-total HKD $700.00, Basket Discount "- <promotion name> - HKD $50.00", Total HKD $650.00
- Cleanup: remove the cart item; delete the promotion (confirm DELETE) and the list count drops by 1

## Notes
2026-10-27 manual: pass with X 700 / Y 750 (discount capped at sub-total, Total HKD $0.00). Whether Y >= X should be allowed and whether "over" means >= is Q-014. End time picker is hourly only (Q-015).
