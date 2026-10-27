---
id: SBF-016
title: "Guest places a bank transfer order with home delivery"
feature: checkout
priority: P0
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
A guest can buy a non-quota product with home delivery and Bank Transfer, and the CRM order matches.

## Preconditions
- Logged out; promo popup and notification prompt dismissed
- A non-quota product (quota products need a member; accepted behavior, BUG-005 closed as wont-fix)

## Data
- Guest name/email/phone: realistic, unique email
- Bank Transfer (fn-bank-transfer) only

## Steps
1. Add the product to the cart and open /checkout
2. Fill Your Details as guest
3. Shipping Method 住宅送貨, recipient, phone, address, delivery date, time slot and every other Delivery Info field
4. Payment Bank Transfer, tick 結帳前同意, Proceed to checkout
5. Open the order in the CRM

## Expected
- Missing delivery info is refused with a message
- Thank-you page /checkout/thank-you?txn_key=TXN... with the order number and UPLOAD PAYMENT PROVE
- CRM order: Pending Payment, Bank Transfer, total, recipient, address and delivery info as entered

## Notes
2026-10-27: TXN0126102700006 (NAKAJIMA cake HKD 0.10, shipping HKD 0.00). Delivery date value carries a stray time ("2026-10-29 11:18:29"). Copy: "All Delivery info selection should be choose." (BUG-008).
