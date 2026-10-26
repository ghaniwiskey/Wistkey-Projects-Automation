---
id: SCRM-045
title: "Product page shows options, price, and related promotions"
feature: storefront
priority: P1
tags: [smoke]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
A shopper can review product information, selectable options, and related promotions.

## Preconditions
- An active storefront product with options and a related promotion is available.

## Data
- Product and option selected from current storefront data.

## Steps
1. Open the staging storefront in a clean browser session.
2. Open an active product that has options and at least one related promotion.
3. Select an available option and review the displayed price and related promotions.

## Expected
- The product page shows the selected product name, option, and corresponding price.
- Related promotions are linked to the selected product.
- No item is added to the cart.

## Notes
Read-only. Do not add the product to cart or submit an order.
