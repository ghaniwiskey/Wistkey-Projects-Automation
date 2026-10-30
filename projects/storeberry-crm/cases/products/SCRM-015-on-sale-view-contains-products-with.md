---
id: SCRM-015
title: "On-sale view contains products with active discounts"
feature: products
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-30
---

## Goal
The On Sale Products view contains only products currently marked on sale.

## Preconditions
- Dedicated Storeberry Flower staging admin account is configured in local .env.

## Steps
1. Sign in to the staging CRM and open Products.
2. Select On Sale Products.
3. Open a few listed products and compare Original Price with Final Price; then open a product that is not in the view.

## Expected
- The view is filtered to its on-sale product set.
- Each listed product has at least one variant whose Final Price is below its Original Price.
- A product outside the view has Final Price equal to Original Price.
- The count changes with the current data and is not hard-coded.

## Notes
Read-only. Do not modify pricing or promotions. The list's Promotions and discounts column is not a sale indicator: every product shows the whole-basket promotion.
