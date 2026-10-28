---
id: SCRM-095
title: "Warehouse Users panel shows the users already mapped to the warehouse"
feature: inventory
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Staff can see and keep existing warehouse user mappings before saving changes.

## Preconditions
- A warehouse with at least one mapped user (check POST /inventory/get-warehouse-detail -> mapped_user_ids)

## Data
- Warehouse found at runtime

## Steps
1. Open Inventory > Warehouses, search the warehouse and click Edit
2. Read the Warehouse Users field

## Expected
- The mapped users are shown as selected chips
- No "error exist!" toast appears

## Notes
Read-only check; do not click Save Users unless the shown list is right. BUG-020 (failed on 2026-10-27) was set to verified by the user on 2026-10-28: retest passed on 2026-10-28 (runs/2026-10-28_1155_staging_manual).
