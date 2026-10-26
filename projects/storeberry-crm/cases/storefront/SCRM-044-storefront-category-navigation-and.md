---
id: SCRM-044
title: "Storefront category navigation and search return matching products"
feature: storefront
priority: P1
tags: [smoke]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
A shopper can browse a storefront category and find an active product by search.

## Preconditions
- An active product is listed in a storefront category.

## Data
- Category and active product selected from current storefront data.

## Steps
1. Open the staging storefront in a clean browser session.
2. Open an existing product category.
3. Search for the exact name of an active product in that category.

## Expected
- The category page shows products assigned to that category.
- Search results include the selected active product and link to its product page.

## Notes
Read-only storefront scenario. Do not add products to cart or submit an order.
