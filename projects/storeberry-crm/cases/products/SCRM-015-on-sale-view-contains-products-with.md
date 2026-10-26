---
id: SCRM-015
title: "On-sale view contains products with active discounts"
feature: products
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
The On Sale Products view contains only products currently marked on sale.

## Preconditions
- Dedicated Storeberry Flower staging admin account is configured in local .env.

## Steps
1. Sign in to the staging CRM and open Products.
2. Select On Sale Products.
3. Review the visible product prices and promotion/discount indicators.

## Expected
- The view is filtered to its on-sale product set.
- Each visible result has an on-sale price or active promotion/discount indicator.
- The count changes with the current data and is not hard-coded.

## Notes
Read-only. Do not modify pricing or promotions.
