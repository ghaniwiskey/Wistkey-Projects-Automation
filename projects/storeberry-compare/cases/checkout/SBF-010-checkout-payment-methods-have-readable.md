---
id: SBF-010
title: "Checkout payment methods have readable unique names"
feature: checkout
priority: P2
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Customers can tell payment methods apart.

## Steps
1. Add a product to the cart and open checkout
2. Open the Payment Methods dropdown and read every option

## Expected
- The Payment Methods list loads and includes "Bank Transfer - 3 Work Days"
- Selecting Bank Transfer shows the bank account details

## Notes
Read-only. BUG-004 is wont-fix (2026-10-27): raw labels such as "order.checkout_v2.methods.fn-allinpay" and the duplicate FPS/PayMe entries are accepted behavior and are not checked here.
