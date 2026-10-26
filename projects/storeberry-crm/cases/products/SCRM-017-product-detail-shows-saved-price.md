---
id: SCRM-017
title: "Product detail shows saved price, options, and platform status"
feature: products
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
A CRM user can review an existing product and confirm its saved catalog data.

## Preconditions
- The staging catalog contains at least one active product; a product with options is preferred.

## Steps
1. Sign in to the staging CRM and open Products.
2. Open an active product with at least one option, if available.
3. Compare its name, product type, price, category, options, and platform status with the list.

## Expected
- The detail view shows the same product identity and saved price as the list.
- Available options, category, and platform status are visible and correspond to the selected product.
- No fields are edited or saved.

## Notes
Read-only. Leave the product unchanged.
