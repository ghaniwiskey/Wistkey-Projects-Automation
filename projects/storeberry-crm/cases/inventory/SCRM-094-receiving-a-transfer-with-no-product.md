---
id: SCRM-094
title: "Receive with no product toggled leaves the transfer In-transit"
feature: inventory
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-30
---

## Goal
Receive on an in-transit transfer with no product row marked as received changes nothing.

## Preconditions
- An own QA transfer order in In-transit status

## Data
- Transfer created at runtime (small qty between two warehouses)

## Steps
1. Open the In-transit transfer detail
2. Leave every Received All / row toggle off and click Receive
3. Click OK in "Confirm receive"

## Expected
- The dialog closes without a message (accepted)
- Status stays In-transit, Receive Qty 0 and no stock moves

## Notes
BUG-019, closed as wont-fix (accepted behavior): no message is shown. POST /inventory/transfer-receive returns 200 and nothing changes.
