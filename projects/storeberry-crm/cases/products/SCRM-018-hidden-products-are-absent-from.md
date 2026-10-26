---
id: SCRM-018
title: "Hidden products are absent from storefront category listings"
feature: products
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
A hidden product remains active in CRM but is not publicly discoverable in the storefront catalog.

## Preconditions
- The staging CRM has an active Hidden Product available.

## Data
- Name of an existing active Hidden Product; do not change it.

## Steps
1. Sign in to the staging CRM and identify an active product whose visibility is Hidden Product.
2. Open Visit my online store in a separate tab.
3. Search the storefront for the exact product name and browse its relevant category.

## Expected
- The active product remains present in the CRM with Hidden Product visibility.
- The exact product is not shown in storefront search or category results.

## Notes
Read-only. Do not create, edit, or terminate a product.
