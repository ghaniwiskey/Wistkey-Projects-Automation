---
id: SCRM-077
title: "Edit this order keeps warehouse, shipping store, remark and product names"
feature: orders
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Editing an order changes only what the user changed.

## Preconditions
- A pending QA order with warehouse Office and a customer remark

## Data
- Reduce one line by 1

## Steps
1. Order detail > Actions > Edit this order > Use order creation date
2. Check the POS warehouse matches the order warehouse
3. Reduce one line by 1, Total > Bank Transfer > CHECK OUT > OK > Done
4. Open the replacement order (…A) in the CRM and in eShop My Orders

## Expected
- Original order is Canceled and the replacement total is reduced by the line price
- Warehouse and Shipping Store equal the original
- Customer remark appears once
- Product names are unchanged (same language as the original)
- Internal remark contains the original order number

## Notes
Currently fails (warehouse switched to TaiPo, remark duplicated, CN names), 2026-10-27.
