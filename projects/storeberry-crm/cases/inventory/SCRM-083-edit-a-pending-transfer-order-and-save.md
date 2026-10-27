---
id: SCRM-083
title: "Edit a pending transfer order and save the change"
feature: inventory
priority: P0
tags: [smoke, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
A pending transfer order can be edited and saved.

## Preconditions
- A QA transfer order created for this test (TaiPo Warehouse -> test 1, 1 x an in-stock product)

## Data
- Qty 1 -> 2
- Remark: Aside QA test transfer - edited

## Steps
1. Open the QA transfer > Edit Transfer Order
2. Change Qty to 2 and the Remark
3. Submit > Confirm
4. Reopen the transfer detail
5. Cancel the QA transfer afterwards

## Expected
- "Update successful"-type message, no "The deleted ids must be a valid JSON string."
- Detail shows Qty 2 and the new remark

## Notes
BUG-008 ("The deleted ids must be a valid JSON string.") verified fixed on 2026-10-27; this case must pass. Cancel the QA transfer after the test to release stock.
