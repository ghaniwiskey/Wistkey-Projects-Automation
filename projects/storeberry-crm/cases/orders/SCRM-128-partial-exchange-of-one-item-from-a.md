---
id: SCRM-128
title: "Partial exchange of one item from a multi-item order settles the price difference"
feature: orders
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Exchanging part of an order charges or refunds exactly the difference.

## Preconditions
- A completed QA order with two products
- A more expensive product to exchange to

## Data
- Cash only (POS) or original payment method

## Steps
1. Order detail > Exchange / Partial Return (POS in iframe): return 1 item and add the more expensive product
2. Pay the difference and finish
3. Open the original and the linked exchange order; read Inventory

## Expected
- Balance due = new item price - returned item net price
- Linked exchange order shows the returned and the new item; original keeps the other item
- Returned item stock +1, new item stock -1

## Notes
Idea from explorations/2026-10-27-fulfilment-stock.md. Points rule on exchange: BUG-017 closed as wont-fix.
