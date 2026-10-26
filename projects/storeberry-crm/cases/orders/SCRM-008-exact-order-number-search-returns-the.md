---
id: SCRM-008
title: "Exact order-number search returns the matching order"
feature: orders
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
A CRM user can locate one order by its exact order number.

## Preconditions
- Dedicated Storeberry Flower staging admin account is configured in local .env.

## Data
- Order number of an existing staging order; keep it out of reports.

## Steps
1. Sign in to the staging CRM.
2. Open Orders and choose a date range that includes an existing order.
3. Select an order from the list and note its order number.
4. Enter that exact number in Order No. and run the search.

## Expected
- The result count is 1 and the single row shows the selected order number.
- Customer names, contact details, and order contents are not copied into reports.

## Notes
Read-only. Do not change order status or expose customer/order details.
