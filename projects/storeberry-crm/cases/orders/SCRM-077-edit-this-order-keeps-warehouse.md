---
id: SCRM-077
title: "Edit this order replaces the order with the reduced total and links the original"
feature: orders
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-30
---

## Goal
Editing an order cancels the original and creates a replacement with the edited quantities.

## Preconditions
- A pending QA order with warehouse Office and a customer remark

## Data
- Reduce one line by 1

## Steps
1. Order detail > Actions > Edit this order > Use order creation date
2. Reduce one line by 1, Total > Bank Transfer > CHECK OUT > OK > Done
3. Open the replacement order (…A) in the CRM and in eShop My Orders
4. Cleanup: void the replacement order

## Expected
- Original order is Canceled and the replacement total is reduced by the line price
- Internal remark contains the original order number

## Notes
BUG-010, closed as wont-fix (accepted behavior): the edit can switch the warehouse to the POS default (TaiPo), drop the Shipping Store, repeat the customer remark and show product names in another language; these are not checked here. Which warehouse online orders should use: Q-009.
