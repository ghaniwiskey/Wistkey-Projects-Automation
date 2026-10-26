---
id: SCRM-026
title: "Purchase order detail reconciles supplier, warehouse, items, and cost"
feature: inventory
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
A CRM user can review purchase order details and reconcile them with the list summary.

## Preconditions
- At least one purchase order with line items exists in staging.

## Steps
1. Sign in to the staging CRM and open Inventory > Purchase Orders.
2. Open an existing purchase order.
3. Compare its supplier, warehouse, status, line items, quantities, and total cost with the list summary.

## Expected
- The detail page identifies the same PO/Lot number and status as the list.
- Supplier, warehouse, line items, quantities, and total cost are visible and consistent with the selected record.

## Notes
Read-only. Do not edit, receive, or export the purchase order.
