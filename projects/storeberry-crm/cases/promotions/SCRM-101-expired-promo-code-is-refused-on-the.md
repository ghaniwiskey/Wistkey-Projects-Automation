---
id: SCRM-101
title: "Expired promo code is refused on the eShop"
feature: promotions
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Ending a promotion in the CRM stops its code from working on the eShop.

## Preconditions
- Product C (HKD 700.00) is sold on the eShop

## Data
- A minimum-spend promotion created at runtime as in SCRM-098 (X = 700, code `<unique>`)

## Steps
1. In the CRM edit the promotion: start yesterday 00:00, end yesterday 23:00; Save -> Expect: list status "expired"
2. As a guest add product C to the cart, open checkout, enter the code and click APPLY

## Expected
- Message "Promotion code is invalid, expired or exceed the usage limit"
- No Basket Discount line; Total equals Sub-total
- Cleanup: empty the cart; delete the promotion

## Notes
2026-10-27 manual: pass (expired by an end date before the start, see BUG-024; use a valid past window in the test).
