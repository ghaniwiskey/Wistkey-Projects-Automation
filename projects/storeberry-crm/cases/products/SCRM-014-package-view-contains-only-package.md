---
id: SCRM-014
title: "Package view contains only package products"
feature: products
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
The Package product view displays records classified as packages.

## Preconditions
- Dedicated Storeberry Flower staging admin account is configured in local .env.

## Steps
1. Sign in to the staging CRM and open Products.
2. Select Package.
3. Review the listed product types across the result pages.

## Expected
- Every listed row has Product Type Package.
- The displayed product count matches the filtered package result set and is not hard-coded.

## Notes
Read-only. Do not add or edit products.
