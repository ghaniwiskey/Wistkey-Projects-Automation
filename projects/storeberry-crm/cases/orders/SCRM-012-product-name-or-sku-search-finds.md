---
id: SCRM-012
title: "Product name or SKU search finds matching orders"
feature: orders
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
A CRM user can find orders containing a selected product by its name or SKU.

## Preconditions
- Dedicated Storeberry Flower staging admin account is configured in local .env.

## Data
- Product name or SKU from an existing staging order; do not include customer details.

## Steps
1. Sign in to the staging CRM and open Orders.
2. Choose an existing order with a product line and note the product name or SKU privately.
3. Enter the product name or SKU in Product Name / SKU and run the search.

## Expected
- The result includes the order containing the selected product.
- The result count reflects the matching orders and no customer details are included in reports.

## Notes
Read-only. Avoid exposing customer/order PII.
