---
id: SBF-005
title: "Member places a bank transfer order with store pickup"
feature: checkout
priority: P0
tags: [smoke, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
A logged-in member can place an order paid by Bank Transfer and it appears in My Orders and the CRM.

## Preconditions
- A QA member account (email @example.com)
- User approval to create one staging order

## Data
- An in-stock product found at runtime
- Shipping: Hong Kong, 門市自取, first listed pickup store
- Payment: Bank Transfer - 3 Work Days only

## Steps
1. Log in to the eShop as the QA member
2. Add an in-stock product and open checkout
3. Check Your Details are pre-filled with the member data
4. Choose 門市自取 and a pickup store, enter a QA address and remark
5. Select Bank Transfer, tick 結帳前同意, dismiss any notification prompt
6. Click Proceed to checkout
7. Open My Account > My Orders
8. In the CRM search Orders by the order number

## Expected
- Thank-you page shows "YOUR ORDER NO.: TXN..." and the cart badge is 0
- My Orders lists the order as Pending Payment
- CRM order shows Pending Payment, Bank Transfer, the same items, quantities and total, delivery method 門市自取 and the remark

## Notes
Never choose a card/wallet payment. Verified manually 2026-10-27: TXN0126102700002 (HKD 400.00).
