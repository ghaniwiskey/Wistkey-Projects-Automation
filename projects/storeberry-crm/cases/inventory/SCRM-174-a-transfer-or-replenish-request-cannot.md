---
id: SCRM-174
title: "A transfer above the source available stock is accepted and leaves the source available negative"
feature: inventory
priority: P0
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-30
---

## Goal
Documents the accepted behavior: transfers and replenish requests are not limited by the source available quantity, and the shortfall shows as negative available.

## Preconditions
- A QA product with a known small Available in the source warehouse (read in Inventory)

## Data
- Qty: Available + 1

## Steps
1. Add Transfer Order from that warehouse with qty Available + 1; Submit > Confirm
2. Read the source warehouse Available in Inventory
3. Cleanup: cancel the QA transfer

## Expected
- Step 1: the transfer is saved as Pending without a message
- Step 2: source Available = previous Available - qty (here -1)
- Step 3: after cancelling, source Available is back to its previous value

## Notes
Gap from the 2026-10-29 review, sixth pass. Never tested. BUG-007, closed as wont-fix (accepted behavior): over-available transfers and replenish requests are allowed.
