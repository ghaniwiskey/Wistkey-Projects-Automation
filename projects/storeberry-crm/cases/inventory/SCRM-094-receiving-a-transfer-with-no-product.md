---
id: SCRM-094
title: "Receiving a transfer with no product toggled tells staff to select items"
feature: inventory
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Receive on an in-transit transfer gives feedback when no product row is marked as received.

## Preconditions
- An own QA transfer order in In-transit status

## Data
- Transfer created at runtime (small qty between two warehouses)

## Steps
1. Open the In-transit transfer detail
2. Leave every Received All / row toggle off and click Receive
3. Click OK in "Confirm receive"

## Expected
- A message says to select at least one product (or Receive is disabled)
- Status stays In-transit and no stock moves

## Notes
Currently fails: BUG-019 (2026-10-27). POST /inventory/transfer-receive returns 200 and nothing changes.
