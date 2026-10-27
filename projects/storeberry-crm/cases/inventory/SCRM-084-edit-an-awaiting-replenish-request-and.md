---
id: SCRM-084
title: "Edit an awaiting replenish request and save the change"
feature: inventory
priority: P0
tags: [smoke, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
An awaiting replenish request can be edited and saved.

## Preconditions
- A QA replenish request created for this test

## Data
- Qty 1 -> 2
- Remark: Aside QA test replenish - edited

## Steps
1. Open the QA replenish request > Edit Replenish Request
2. Change Qty to 2 and the Remark
3. Submit > Confirm
4. Reopen the detail
5. Cancel the QA request afterwards

## Expected
- "Update successful"-type message, no "The deleted ids must be a valid JSON string."
- Detail shows Qty 2 and the new remark

## Notes
Linked bug: storeberry-crm BUG-008.
