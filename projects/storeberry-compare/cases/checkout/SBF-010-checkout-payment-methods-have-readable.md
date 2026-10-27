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
- No option text starts with "order.checkout_v2."
- No two options have the same text

## Notes
Read-only. Currently fails (raw keys, duplicate FPS/PayMe), 2026-10-27.
