---
id: SCRM-078
title: "Create, edit and cancel a purchase order"
feature: inventory
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Purchase orders can be created, edited and cancelled without affecting stock.

## Data
- Supplier: Default Supplier
- Warehouse: test 1
- Product of that supplier, qty 1, unit cost 1

## Steps
1. Add Purchase Order with empty form > Submit
2. Fill supplier, warehouse, remark, one product qty 1 cost 1 > Submit > Confirm
3. Edit Purchase Order: qty 2 and new remark > Submit > Confirm
4. Cancel Purchase Order > CONFIRM

## Expected
- Empty submit shows "Please select supplier"
- Create shows "Create successful..." and status Processing
- Edit shows "Update successful..." and total cost $2.00
- Cancel shows "Order status successfully updated" and status Canceled

## Notes
Verified 2026-10-27 (Lot2610270247224c90). Never click Receive in this case.
