---
id: SCRM-144
title: "A new product published in the CRM appears on the eShop with its price, options and stock"
feature: products
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Staff can launch a product and customers can buy it straight away.

## Preconditions
- A QA product we create (not hidden), with 2 variants, a category and stock moved in by transfer

## Data
- Price and variants chosen at runtime

## Steps
1. Create and save the product visible on Online Shop
2. Open its category and search on the eShop
3. Open the product page and add each variant

## Expected
- The product is listed in its category and search with the CRM price
- Variants and stock match; a variant with 0 stock shows SOLD OUT
- Cleanup: terminate the product (ask: terminate is @final, see SCRM-002)

## Notes
Gap from the 2026-10-29 critical-flow review, third pass (no existing case found by search). Never tested. SCRM-018 only checks that hidden products are absent.
