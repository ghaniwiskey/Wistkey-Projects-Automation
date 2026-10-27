---
id: SCRM-110
title: "Voiding an unpaid eShop order releases its reserved stock"
feature: orders
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Stock reserved by an online order comes back when staff void it.

## Preconditions
- An unpaid eShop Bank Transfer order placed by a QA member during the test (e.g. from SCRM-106)

## Steps
1. Before the order: Inventory, search the product SKU, note Available Qty, Stock Qty and the order warehouse column (TaiPo)
2. After the order: read the same row
3. Order detail > Actions > Void this order > Yes
4. Reload the order and read the inventory row again

## Expected
- Step 2: Available and the warehouse column drop by the ordered quantity; Stock Qty unchanged
- Step 4: Order Status and Payment Status Canceled
- Step 4: Available and the warehouse column are back to the step 1 values

## Notes
2026-10-28 manual: pass. Product C (SKU CCCCC), TXN0126102700025: Available 14999915 -> 14999914 -> 14999915, TaiPo 999970 -> 999969 -> 999970, Stock 14999984 throughout. The single-use code stays Used after the void (Q-017).
