---
id: SCRM-123
title: "Editing an order that redeemed cash dollars keeps the points balance correct"
feature: orders
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Points spent on an order are neither lost nor charged twice when the order is edited.

## Preconditions
- An unpaid eShop order of a QA member that redeemed cash dollars (e.g. $100 = 100 points)
- Order detail > Actions > Edit this order opens the Web POS and, on CHECK OUT, cancels the original and creates a replacement order "<number>A" (README; BUG-010)

## Steps
1. Note member points and the order's cash dollar line
2. Edit this order, reduce a line by 1, finish
3. Reread the replacement order and the member Point History

## Expected
- Step 3: the replacement order shows the cash dollar redemption (or the points are returned with a "Void - Cash Dollar" row)
- Step 3: net points change across original + replacement = one redemption only

## Notes
Never tested (2026-10-28 review). Cash dollar rule: 100 points = $100, max $100 per order (README).
