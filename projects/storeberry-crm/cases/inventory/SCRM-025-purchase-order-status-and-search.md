---
id: SCRM-025
title: "Purchase order status and search filters match records"
feature: inventory
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
Purchase order status tabs and search fields return matching purchase orders.

## Preconditions
- At least one purchase order exists in staging.

## Data
- Existing PO/Lot number and product name or SKU, selected dynamically.

## Steps
1. Sign in to the staging CRM and open Inventory > Purchase Orders.
2. Select Processing, Partial Received, Received, and Canceled in turn.
3. Search for an existing PO/Lot number, then separately search by a product name or SKU.

## Expected
- Rows in each status view show the selected status.
- An exact PO/Lot search returns the matching record.
- A product search returns only purchase orders containing the selected product.

## Notes
Read-only. Do not create, receive, cancel, or export purchase orders.
