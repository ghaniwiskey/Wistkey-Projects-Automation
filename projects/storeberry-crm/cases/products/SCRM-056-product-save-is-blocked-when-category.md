---
id: SCRM-056
title: "Product save is blocked when category is missing"
feature: products
priority: P2
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
The product form requires a category and does not persist an incomplete product.

## Preconditions
- A staging product form is available and an unused QA name can be selected.

## Data
- Product name: QA-<unique>.
- Visibility: Hidden Product.
- Leave category blank.

## Steps
1. Sign in to the staging CRM and open Add Product.
2. Enter the unique QA name, select Hidden Product, and leave Category empty.
3. Attempt to save.
4. Search the active and terminated product lists for the QA name.

## Expected
- The form identifies Category as required and remains available for correction.
- No product with the QA name is created.

## Notes
Validation-only. Staging only; do not create a product in this scenario.
