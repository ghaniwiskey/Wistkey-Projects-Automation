---
id: SCRM-174
title: "A transfer or replenish request cannot move more than the source warehouse has available"
feature: inventory
priority: P0
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Stock movements never push available stock below zero.

## Preconditions
- A QA product with a known small Available in the source warehouse (read in Inventory)

## Data
- Qty: Available + 1, and 99999

## Steps
1. Add Transfer Order from that warehouse with qty Available + 1; Submit
2. Edit a pending QA transfer and type 99999
3. Add Replenish Request with qty above the source Available

## Expected
- Each is refused or warned before Confirm; nothing is reserved
- Available never shows a negative value
- Cleanup: cancel any QA transfer/request created

## Notes
Gap from the 2026-10-29 review, sixth pass (no existing case found by search). Never tested. Linked bug: BUG-007 (open, major).
