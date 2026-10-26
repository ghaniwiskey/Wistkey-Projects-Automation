---
id: SCRM-058
title: "Product form blocks duplicate SKU or barcode identifiers"
feature: products
priority: P2
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
The product form prevents a new QA product from saving with an identifier already assigned to another product.

## Preconditions
- An existing active staging product has a SKU or barcode that can be retrieved from the UI.

## Data
- Existing SKU or barcode chosen dynamically.
- New product name: QA-<unique>.

## Steps
1. Sign in to the staging CRM and identify an existing product SKU or barcode.
2. Open Add Product and enter a unique QA name and the existing identifier in the corresponding field.
3. Complete other required fields with staging values and attempt to save.
4. Search the active product list for the QA name.

## Expected
- The form rejects the duplicate identifier with a visible validation message.
- No duplicate QA product is created.

## Notes
Validation scenario. If the duplicate is accepted, stop and record the unexpected product; do not delete it as part of this scenario.
