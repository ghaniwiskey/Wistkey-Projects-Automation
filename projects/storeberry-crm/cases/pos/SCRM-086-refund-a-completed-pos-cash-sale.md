---
id: SCRM-086
title: "Refund a completed POS cash sale reverses payment and points and keeps fulfilment closed"
feature: pos
priority: P0
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
A full refund of a POS sale creates a linked refund order, reverses earned points and does not reopen delivery.

## Preconditions
- A completed QA POS cash sale (SCRM-085)

## Data
- QA POS order created in the same session

## Steps
1. Open the POS order detail, Actions > Refund this order
2. Choose Original Payment Method, add a remark, Refund > Yes
3. Read Order Status, Payment Status, Delivery Status and the Refund order link
4. Open the refund order and the member Point History

## Expected
- Order Status and Payment Status Refunded; a refund order <TXN>R exists with Cash -<amount>
- Point History has Refund - Transaction removing the points earned by the order
- Delivery Status stays Complete (the goods left the store at the sale)

## Notes
Related to SCRM-051 (generic refund). 2026-10-27: Delivery Status flipped Complete -> Pending (BUG-012). Upgrade Reward and Silver tier from the refunded sale were kept (question).
