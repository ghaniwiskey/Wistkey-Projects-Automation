---
id: SCRM-121
title: "Editing a paid order to a higher total leaves the extra amount outstanding until it is paid"
feature: orders
priority: P0
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Adding items to a paid order cannot mark the extra amount as paid by itself.

## Preconditions
- A QA member's eShop order paid by Bank Transfer with the receipt accepted (Processing / Complete), placed during the test
- Order detail > Actions > Edit this order opens the Web POS and, on CHECK OUT, cancels the original and creates a replacement order "<number>A" (README; BUG-010)

## Data
- Bank Transfer only

## Steps
1. Edit this order, raise a line quantity by 1 (or add a product), Total
2. Pay only what the POS asks as the balance with Bank Transfer, finish
3. Open the replacement order

## Expected
- Step 1: the POS shows the amount already paid and Balance due = the added amount only
- Step 3: Total = old total + added amount; Outstanding balance = added amount until a receipt for it is accepted; status not Complete before that
- Step 3: the replacement keeps the original warehouse, shipping store, remark and product names (BUG-010)

## Notes
2026-10-28 manual: fail, BUG-027. Balance due $ -894.00 (full total, not 384); 007A Pending Payment, Outstanding 894.00; the customer's eShop order asks for the full 894.00 (TXN0126102800007 -> 007A). Warehouse, store and product name kept (both TaiPo).

Never tested before (2026-10-28 review). Q-011 asks whether Bank Transfer entered in the POS should count as paid.
