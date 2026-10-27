---
id: SCRM-106
title: "Single-use generated promo code discounts an eShop order once and is marked Used with the order"
feature: promotions
priority: P0
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
A generated single-use code gives the right discount on a real Bank Transfer order, the CRM order totals match the checkout, and the code cannot be used twice.

## Preconditions
- Staging CRM login; a QA promotion "Promo Code: Get Y% off with discount code X", Applied Shop Online Shop, Multiple Promotion Code (created during the test, e.g. 662), Y = 10, quota 2, codes generated
- A QA member is logged in on the eShop with an empty cart; a non-quota product found at runtime (e.g. C)

## Data
- Bank Transfer (fn-bank-transfer) only; shipping 門市自取 with a pickup store

## Steps
1. On the eShop add the product, open /checkout and note the totals without a code
2. Apply code 1 -> Expect: "Applied: <code>", Basket Discount line named after the promotion = 10% of the sub-total; member-level promotions (e.g. Silver 15%) are applied on the remaining amount
3. Place the order with Bank Transfer
4. In the CRM open the order and the promotion's Multiple Promotion Code tab
5. Back on the eShop add a product again and apply code 1

## Expected
- Thank-you page with the order number
- CRM order: Pending Payment, Basket Discount lists the code promotion and the member promotion with the same amounts as the checkout; Total and Bank Transfer payment equal the checkout total
- Code 1: Status Used, Txn No. = the order, Txn Member ID = the member; Stock count drops by one
- Re-applying code 1 -> "Promotion code is invalid, expired or exceed the usage limit" and no discount
- Cleanup: void the order (SCRM-110) and empty the cart

## Notes
2026-10-28 manual: pass. Promotion 662, code QA1pr6iu, TXN0126102700025: C HKD 600.00, code -60.00, Silver -81.00, Total 459.00 in checkout and CRM. The CRM order shows the promotion name but not which code was used. Whether voiding should release the code: Q-017.
