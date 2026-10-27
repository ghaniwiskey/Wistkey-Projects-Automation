---
id: SCRM-057
title: "Product form rejects a non-positive price"
feature: products
priority: P2
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-27
---

## Goal
The product form rejects a zero or negative price without saving the product.

## Preconditions
- A staging product form and an existing category are available.

## Data
- Product name: QA-<unique>.
- Price: 0, then -1 only if the form allows a second validation attempt.
- An existing category selected from the UI.

## Steps
1. Sign in to the staging CRM and open Add Product.
2. Enter a unique QA name, select an existing category, and enter price 0.
3. Attempt to save; if the form accepts the input, correct it and try -1.
4. Search product lists for the QA name.

## Expected
- The form displays a price validation error for each attempted non-positive value.
- No product is created with the invalid price.

## Notes
Validation-only. Stop if an invalid value is accepted and do not create additional test products. 2026-10-27: the price fields reset typed negatives to 0, and a HKD 0.00 hidden product saved without any message (product 3199, terminated afterwards). Open question to the product owner whether 0 must be allowed (free gifts); until answered, this expectation is unconfirmed.
