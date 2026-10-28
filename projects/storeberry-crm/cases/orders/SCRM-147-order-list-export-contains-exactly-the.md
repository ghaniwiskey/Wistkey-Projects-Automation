---
id: SCRM-147
title: "Order list export contains exactly the filtered orders with correct amounts"
feature: orders
priority: P2
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Finance can rely on exported order data.

## Preconditions
- Order list filter with a small result set (e.g. one day of QA orders)

## Data
- Filter chosen at runtime

## Steps
1. Filter the order list
2. Export
3. Compare the file with the list

## Expected
- Same order numbers and count; totals, status and paid dates match; Chinese text is readable (UTF-8)

## Notes
Gap from the 2026-10-29 critical-flow review, third pass (no existing case found by search). Never tested.
