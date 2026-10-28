---
id: BUG-020
title: "Warehouse Users panel never shows mapped users (\"error exist!\"), so Save Users overwrites existing mappings"
severity: major
status: verified
env: staging
url: "https://www.stagingl10.storeberry.xyz/inventory/warehouses"
updated: 2026-10-28T04:28:21.301Z
found: 2026-10-27T10:00:33.219Z
foundBy: "explorations/2026-10-27-stock-movement.md"
tests: [SCRM-095]
frequency: always
---
## Summary
Opening a warehouse Edit panel shows an "error exist!" toast and an empty Warehouse Users field, even when users are mapped. POST /inventory/get-warehouse-detail returns mapped_user_ids as a serialized PHP collection object ({"\u0000*\u0000items":[116,152,156,158],"\u0000*\u0000escapeWhenCastingToString":false}) instead of an array, so the panel cannot preselect them. Save Users replaces the whole list with what is selected (response mapped_user_ids [158]), so anyone saving from this panel silently removes the existing users.

## Steps to reproduce
1. Inventory > Warehouses, search "Causeway", click Edit
2. Read Warehouse Users
3. Compare with POST /inventory/get-warehouse-detail (id 2) mapped_user_ids

## Expected
Mapped users (116, 152, 156, 158 for Causeway Bay) are shown as selected; no error toast.

## Actual
Field empty, "error exist!" toast. Reproduced on TaiPo (twice) and Causeway Bay. Saving TaiPo with only ghani returned mapped_user_ids [158]; any previous TaiPo users would have been removed (previous list unknown because the panel never showed it).

## Evidence
- Screenshot: ![warehouse users empty](../explorations/2026-10-27-stock-movement/08-warehouse-users-empty-error-exist.jpg)

## Environment
- Base URL: https://www.stagingl10.storeberry.xyz/inventory/warehouses
- Env: staging

## History
- 2026-10-27: filed from explorations/2026-10-27-stock-movement.md in the Test Manager app.
- 2026-10-28: status open -> verified.
- 2026-10-28: Case SCRM-095 notes updated: expected to pass (bug set to verified by the user)..
