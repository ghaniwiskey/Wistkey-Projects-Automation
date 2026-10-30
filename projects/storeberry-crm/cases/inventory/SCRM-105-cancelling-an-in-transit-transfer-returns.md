---
id: SCRM-105
title: "Cancelling an In-transit transfer returns the stock to the source warehouse"
feature: inventory
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-30
---

## Goal
A shipped transfer can be cancelled and the source warehouse gets all its stock back.

## Preconditions
- Office has available stock of product test 2

## Data
- Transfer number `<unique>` (QA-TO-<unique>), Office -> TaiPo Warehouse, product test 2 x1

## Steps
1. Add Transfer Order with the data; Submit > Confirm (Pending); note Office stock / available (S / A)
2. Transfer > OK -> Expect: In-transit, Office S-1 / A-1
3. Cancel Transfer > OK -> Expect: status Pending, Office S / A-1
4. Cancel Transfer Orders > OK

## Expected
- Status Canceled; Office back to S / A; TaiPo unchanged
- Inventory History lists IN_TRANSIT, CANCEL_TRANSFER and CANCEL_TRANSFER_ORDER for the transfer number

## Notes
2026-10-27 manual: stock pass (transfer 312 QA-TO-mvqoiwwt, Office 43/43 restored); Transfer time showed the cancel time: BUG-025, closed as wont-fix (accepted behavior), so the transfer time is not checked here. The two-step cancel and label are asked in Q-016.
