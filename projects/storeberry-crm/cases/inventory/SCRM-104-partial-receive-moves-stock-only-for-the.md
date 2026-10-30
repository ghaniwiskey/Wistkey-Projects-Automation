---
id: SCRM-104
title: "Partial receive moves stock only for the received transfer row"
feature: inventory
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-30
---

## Goal
Receiving one row of a multi-product transfer moves only that product and marks the transfer Partial Received.

## Preconditions
- Office has available stock of product test 2 and C

## Data
- Transfer number `<unique>` (QA-TO-<unique>), Office -> TaiPo Warehouse, product test 2 x1 and C x1

## Steps
1. Inventory > Transfer Orders > Add Transfer Order with the data; Submit > Confirm -> Expect: Pending, Office product test 2 available -1
2. Open the transfer, click Transfer > OK -> Expect: In-transit, Office product test 2 stock -1
3. Turn on only the product test 2 row toggle, click Receive > OK

## Expected
- Status Partial Received; product test 2 Receive Qty 1, TaiPo stock and available +1
- C Receive Qty 0; TaiPo C unchanged
- Receive is still offered for the remaining row
- Cleanup: receive the C row (status Received)

## Notes
2026-10-27 manual: pass (transfer 311 QA-TO-mvqodhe9, TaiPo product test 2 9/8 -> 10/9). After a partial receive Cancel Transfer is no longer offered (Q-016). The final receive overwrites Receive Time (BUG-025, closed as wont-fix; not checked here).
