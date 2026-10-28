---
id: SCRM-145
title: "Manual stock adjustment updates inventory, history and eShop availability"
feature: inventory
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Stock corrections by staff are recorded and reach the shop.

## Preconditions
- A QA product with known TaiPo stock

## Data
- Adjustment: +2 then -2

## Steps
1. Adjust stock in Inventory (if the CRM has a direct adjustment; otherwise record that only stock take/transfer change stock)
2. Read Inventory History and the eShop Add To Cart limit

## Expected
- Stock and Available change by the adjustment; history shows who, when, why
- The eShop accepts the new quantity; the -2 restores it

## Notes
Gap from the 2026-10-29 critical-flow review, third pass (no existing case found by search). Never tested.
