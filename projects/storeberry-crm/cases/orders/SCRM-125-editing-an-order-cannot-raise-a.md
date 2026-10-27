---
id: SCRM-125
title: "Editing an order cannot raise a quantity beyond the available stock"
feature: orders
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Staff edits cannot oversell.

## Preconditions
- An unpaid QA order for a product with small available stock in its warehouse
- Order detail > Actions > Edit this order opens the Web POS and, on CHECK OUT, cancels the original and creates a replacement order "<number>A" (README; BUG-010)

## Steps
1. Edit this order and raise the line to available + 1 (+ what the order already holds)
2. Try to finish the POS flow

## Expected
- A stock warning names the product; the replacement is not created without an explicit override
- Inventory Available never goes below 0

## Notes
Never tested (2026-10-28 review). POS Continue on out-of-stock is Q-019.
