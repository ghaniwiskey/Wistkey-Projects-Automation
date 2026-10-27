---
id: SBF-029
title: "Home delivery shipping fee matches the shipping method rule and is charged in the order total"
feature: checkout
priority: P0
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Customers pay the configured delivery fee, and the CRM order shows the same fee.

## Preconditions
- The fee rule of a paid home-delivery method (e.g. 住宅送貨 or SF 住宅) read from CRM Online Store / shipping settings at runtime: flat or by weight
- A QA member; a product with a weight > 0 (e.g. C, 1.000 kg) and a 0 kg product

## Data
- Bank Transfer only

## Steps
1. Add 1 x the weighted product, open /checkout, choose the home-delivery method and fill every Delivery Info field
2. Change quantity so the weight crosses the next weight band (if the rule is by weight)
3. Place the order
4. Open the order in the CRM

## Expected
- Step 1: Shipping Fee = the rule for that weight/region; Total = discounted total + shipping fee (+ rounding)
- Step 2: Shipping Fee changes to the next band
- Step 4: CRM Delivery Cost and Total equal the checkout values; Bank Transfer amount = Total
- Cleanup: void the order

## Notes
Gap: all orders so far had Shipping Fee HKD 0.00 (pickup or 0 kg). "Shipping fee by method/weight ... not explored" (explorations/2026-10-27-guest-order-recovery.md).
