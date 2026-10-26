---
id: SCRM-011
title: "Order detail and history views match the selected order"
feature: orders
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
A CRM user can review an order summary and its associated history without changing it.

## Preconditions
- Dedicated Storeberry Flower staging admin account is configured in local .env.

## Data
- An existing staging order with a detail record.

## Steps
1. Sign in to the staging CRM and open Orders.
2. Open Details for an existing order.
3. Compare the order number and status in the detail view with the selected list row.
4. Review Item, Delivery history, Receipt, and Status History.

## Expected
- The detail page shows the same order number and current order status as the selected row.
- Payment and delivery statuses are visible, and each history view belongs to the selected order.
- No order, payment, delivery, or customer data is changed or included in the test report.

## Notes
Read-only. Do not use Actions, Save, Edit, Print, or customer-message controls.
