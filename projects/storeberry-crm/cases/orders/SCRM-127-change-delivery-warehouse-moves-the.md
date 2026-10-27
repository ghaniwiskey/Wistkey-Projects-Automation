---
id: SCRM-127
title: "Change Delivery Warehouse moves the stock reservation to the new warehouse"
feature: orders
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Switching the fulfilling warehouse keeps stock correct in both warehouses.

## Preconditions
- An unpaid QA online order reserved in warehouse A (e.g. TaiPo); warehouse B with stock for the product

## Steps
1. Note Available in A and B
2. Actions > Change Delivery Warehouse > B, confirm
3. Reread the order and Inventory

## Expected
- Order Warehouse = B
- A Available +qty, B Available -qty; totals unchanged
- Changing to a warehouse without stock is refused or clearly warned

## Notes
Never tested (2026-10-28 review).
