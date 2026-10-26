---
id: SCRM-013
title: "Product ID search returns the selected catalog item"
feature: products
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
A CRM user can locate an active product by its unique product ID.

## Preconditions
- Dedicated Storeberry Flower staging admin account is configured in local .env.

## Data
- Product ID of a currently active staging product.

## Steps
1. Sign in to the staging CRM and open Products.
2. Select an active product and note its Product ID.
3. Enter the ID in Product ID, Name, Option, SKU, Barcode and run the search.

## Expected
- The result count is 1 and the row shows the selected Product ID and product name.
- The selected product remains active and unchanged.

## Notes
Read-only. Do not edit, terminate, or launch products.
