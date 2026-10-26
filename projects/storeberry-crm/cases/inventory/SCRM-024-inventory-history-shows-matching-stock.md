---
id: SCRM-024
title: "Inventory history shows matching stock movements"
feature: inventory
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
A CRM user can find audit records for a selected product movement.

## Preconditions
- At least one inventory movement exists for an active staging product.

## Data
- Product name, SKU, or barcode of an existing item.

## Steps
1. Sign in to the staging CRM and open Inventory History.
2. Search for a product name, SKU, or barcode that has an existing movement.
3. Review the movement type, warehouse, related lot/order reference, date, and staff fields.

## Expected
- The results relate to the selected product.
- Each movement shows its type, warehouse, reference where available, date, and staff.
- No history record is edited or deleted.

## Notes
Read-only. Do not export inventory history.
