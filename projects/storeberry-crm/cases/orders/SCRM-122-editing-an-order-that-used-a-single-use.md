---
id: SCRM-122
title: "Editing an order that used a single-use promo code keeps the right discount and does not consume another code"
feature: orders
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Order edits do not lose or double-use promotion codes.

## Preconditions
- An unpaid eShop order of a QA member placed with a generated single-use code (SCRM-106 set-up)
- Order detail > Actions > Edit this order opens the Web POS and, on CHECK OUT, cancels the original and creates a replacement order "<number>A" (README; BUG-010)

## Steps
1. Note the order discounts and the code row (Used, Txn No.)
2. Edit this order, reduce a line by 1, finish
3. Open the replacement order and the promotion's Multiple Promotion Code tab

## Expected
- Step 3: the replacement order still shows the code promotion, recalculated on the new sub-total (or the POS clearly says the code is dropped)
- Step 3: the code row points to the replacement order (or stays on the original) and no other code changes to Used

## Notes
Never tested (2026-10-28 review). Related: Q-017 (code release on void).
