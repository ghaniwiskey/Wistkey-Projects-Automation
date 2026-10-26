---
id: SCRM-022
title: "Inventory quantities reflect selected warehouse and product variants"
feature: inventory
priority: P0
tags: [smoke]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
A CRM user can inspect available stock by warehouse and variant.

## Preconditions
- At least one active product with variants is available in staging inventory.

## Steps
1. Sign in to the staging CRM and open Inventory.
2. Select a warehouse and locate a product with variants.
3. Choose View by: Variants and review the available, stock, and pre-order quantities.

## Expected
- The inventory view identifies the selected warehouse and product variants.
- Each variant displays its own quantities for the selected warehouse.
- Changing the warehouse changes the warehouse context without altering stock.

## Notes
Read-only. Do not use Import/Export, Actions, or stock adjustment controls.
