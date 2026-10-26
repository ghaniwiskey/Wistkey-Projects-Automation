---
id: SCRM-016
title: "Catalog filters narrow products by category, brand, tag, and platform"
feature: products
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
The product filter panel returns products matching each selected catalog criterion.

## Preconditions
- Dedicated Storeberry Flower staging admin account is configured in local .env.

## Data
- Existing category, brand, and tag values selected from the filter controls.

## Steps
1. Sign in to the staging CRM and open Products.
2. Open Filter and select one existing category; apply the filter and review results.
3. Reset the filter, then repeat separately for an existing brand and tag.
4. Apply Online Platform or Retail Platform status and verify the resulting list.

## Expected
- Each filtered result matches the criterion currently selected.
- Reset returns the product list to its unfiltered state.
- No product attributes are changed.

## Notes
Read-only. Select available values dynamically; do not hard-code changing result counts.
