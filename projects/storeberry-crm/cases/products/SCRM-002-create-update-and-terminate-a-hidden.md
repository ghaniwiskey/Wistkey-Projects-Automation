---
id: SCRM-002
title: "Create, update and terminate a hidden CRM product"
feature: products
priority: P0
tags: [regression, writes, final]
envs: [staging]
automated: true
created: 2026-10-23
updated: 2026-10-26
---

## Goal
A CRM user can create and edit a uniquely named hidden product, then remove it from the active catalog.

## Preconditions
- The staging admin account is configured in local `.env`.
- The existing General category is available (the automation skips clearly if it is not).

## Data
- Unique name: ASIDE-QA-<unique>
- Category: General
- Final price: HKD 1.00, nominal price for a hidden staging-only test product.

## Steps
1. Sign in to the staging CRM as the Storeberry Flower store admin.
2. Open Products and create a physical product with the unique name, General category, HKD 1.00 final price, and Hidden Product visibility.
3. Save and confirm the product appears in the active product list.
4. Open the product and confirm the name, category, price, and Hidden Product visibility were saved.
5. Append -UPDATED to the product name and save.
6. Confirm the updated name and product settings are retained.
7. Select the unique test product and choose Make product terminated in all platforms.

## Expected
- The unique product appears in the active list with its entered name, General category, and HKD 1.00 price.
- The saved visibility remains Hidden Product before and after renaming; the form describes this type as not viewable online but still purchasable.
- After termination, the product is absent from the active list and present in the terminated product list/count.
- No order is created.

## Notes
Staging only. Termination is permanent for the test record, so this is tagged `final`. Obtain explicit approval for each scenario and run/retry. For an approved run, target only SCRM-002 and set `SCRM_002_RUN_APPROVED=true` for that process; do not store this flag in `.env`. The automation is in tests/e2e/products/product-lifecycle.spec.ts and has not been run pending approval. Production is read-only.
