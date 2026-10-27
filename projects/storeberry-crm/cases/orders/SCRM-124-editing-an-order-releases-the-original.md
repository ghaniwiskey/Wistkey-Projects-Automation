---
id: SCRM-124
title: "Editing an order releases the original reservation and reserves only the new quantities"
feature: orders
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Order edits do not leak or double-count reserved stock.

## Preconditions
- An unpaid eShop order of a QA member with 2 units of a stock-tracked product
- Order detail > Actions > Edit this order opens the Web POS and, on CHECK OUT, cancels the original and creates a replacement order "<number>A" (README; BUG-010)

## Steps
1. Note Available for the order warehouse in Inventory
2. Edit this order, reduce the line to 1, keep the same warehouse in the POS, finish
3. Reread Inventory and Inventory History

## Expected
- Step 3: Available is 1 higher than in step 1 (2 released, 1 reserved)
- Step 3: history shows the release for the original and the reservation for the replacement in the same warehouse

## Notes
Never tested (2026-10-28 review). BUG-010: the POS preselects TaiPo, so check the warehouse before CHECK OUT.
