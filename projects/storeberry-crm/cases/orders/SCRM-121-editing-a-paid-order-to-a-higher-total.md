---
id: SCRM-121
title: "Editing a paid order to a higher total creates a Pending Payment replacement for the full total"
feature: orders
priority: P0
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-30
---

## Goal
Documents the accepted behavior when staff add to a paid order: the replacement order asks for its full total.

## Preconditions
- A QA member's eShop order paid by Bank Transfer with the receipt accepted (Processing / Complete), placed during the test
- Order detail > Actions > Edit this order opens the Web POS and, on CHECK OUT, cancels the original and creates a replacement order "<number>A" (README; BUG-010)

## Data
- Bank Transfer only

## Steps
1. Edit this order, raise a line quantity by 1 (or add a product), Total
2. Read Balance due, pay it with Bank Transfer, finish
3. Open the replacement order
4. Cleanup: void the replacement order

## Expected
- Step 2: Balance due = the full new total (old total + added amount)
- Step 3: Total = old total + added amount; status Pending Payment, Outstanding balance = the full total

## Notes
2026-10-28 run: TXN0126102800007 -> 007A (Balance due $ -894.00, 007A Pending Payment, Outstanding 894.00; warehouse, store and product name kept). BUG-027, closed as wont-fix (accepted behavior): editing a paid order discards the payment. BUG-010 (wont-fix) warehouse/remark changes are not checked here. Q-011 asks whether Bank Transfer entered in the POS should count as paid.
