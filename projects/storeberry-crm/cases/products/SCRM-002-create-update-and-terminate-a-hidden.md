---
id: SCRM-002
title: "Create, update and terminate a hidden CRM product"
feature: products
priority: P0
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-23
updated: 2026-10-23
---

## Goal
A CRM user can create a hidden test product, update it, and terminate it without exposing it on the customer storefront.

## Data
- Unique name: SCRM-<unique>
- Existing category: General
- Final price: HKD 1.00

## Steps
1. Log in to the staging CRM as the Storeberry Flower store admin.
2. Create a physical product with the unique name, category General, final price HKD 1.00, and Hidden Product visibility.
3. Save and confirm the product appears in the active product list with its name and HKD 1.00 price.
4. Edit the product name by appending -UPDATED and save.
5. Confirm the updated name appears in the active product list.
6. Select the test product and choose Make product terminated in all platforms.

## Expected
- The new hidden product appears in the active list with the entered name, category and price.
- After editing, the updated name is retained in the active product list.
- After termination, the product is absent from the active product list and appears in the terminated product list/count.
- The test product is not visible in the online storefront, and no order is created.

## Notes
Staging only. Use a unique hidden test product and terminate it as cleanup. Production is read-only.
