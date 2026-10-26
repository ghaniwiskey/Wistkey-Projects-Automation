---
id: SCRM-043
title: "Brand search matches the brand and product count"
feature: brands
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
A CRM user can locate a brand by name or ID and review its product association count.

## Preconditions
- At least one brand exists in staging.

## Data
- Existing brand name or ID, selected dynamically.

## Steps
1. Sign in to the staging CRM and open Brands.
2. Select an existing brand and note its name or ID.
3. Search for the exact brand name or ID.
4. Review the matching row and product-count link.

## Expected
- The search returns the selected brand.
- The row displays the brand identity and its product count; the count is not hard-coded.

## Notes
Read-only. Do not add or edit brands.
