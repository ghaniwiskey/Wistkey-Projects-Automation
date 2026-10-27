---
id: SBF-009
title: "Promotion code: invalid code message and whole-order discount"
feature: checkout
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Promo codes give clear feedback and correct totals.

## Data
- Invalid: BADCODE999
- Valid whole-order code read from CRM Promotions (e.g. VIP888, $20 off)

## Steps
1. Add a product to the cart and open checkout
2. Apply BADCODE999
3. Apply the valid code
4. Click REMOVE

## Expected
- "Promotion code is invalid, expired or exceed the usage limit" is shown and totals do not change
- With the valid code a Basket Discount line appears and Total = Sub-total minus the discount (not below 0)
- After REMOVE the discount line is gone, Total equals Sub-total and the promo box is empty
