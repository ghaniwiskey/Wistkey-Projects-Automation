---
id: BUG-021
title: "Stock take Assignee list is always empty, so no stock take job can be created"
severity: critical
status: verified
env: staging
url: "https://www.stagingl10.storeberry.xyz/stock-take/create"
updated: 2026-10-28T04:55:09.714Z
found: 2026-10-27T10:07:10.196Z
foundBy: "explorations/2026-10-27-stock-movement.md"
tests: [SCRM-030]
frequency: always
---
## Summary
Create Stock Take Job requires an Assignee, but the Assignee dropdown never lists anyone. POST /stock-take/get-warehouse-assignees returns {"result":"OK","users":[]} for every warehouse, including Causeway Bay, where active users 116 (jacky: Stock Take Staff + Stock Take Admin, Causeway Bay assigned), 152, 156 and 158 (ghani: Stock Take Staff + Admin added by the user today) are mapped in both the user record and Warehouse Users. Continue then says "Please select an assignee." so stock take cannot be started.

## Steps to reproduce
1. Log in as ghani (Stock Take Staff + Stock Take Admin, mapped to Causeway Bay and TaiPo); log out and in again to refresh roles
2. Inventory > Stock Take > Create Stock Take Job
3. Enter a Job Name and choose Warehouse Causeway Bay warehouse (or TaiPo Warehouse)
4. Open the Assignee dropdown

## Expected
Active users mapped to the warehouse with a Stock Take role (at least jacky and ghani for Causeway Bay) are listed.

## Actual
Only "-- Select mapped stock take user --"; endpoint returns users []. Same for all 16 warehouses, before and after re-login (checked 4 times). Jobs 14-17 by jacky exist from earlier today, so it worked at some point or for another login.

## Evidence
- Screenshot: ![assignee empty](../explorations/2026-10-27-stock-movement/09-stocktake-assignee-empty.jpg)

## Environment
- Base URL: https://www.stagingl10.storeberry.xyz/stock-take/create
- Env: staging

## History
- 2026-10-27: filed from explorations/2026-10-27-stock-movement.md in the Test Manager app.
- 2026-10-27: Confirmed as a product bug by the user; stays open until a fix is deployed.
- 2026-10-28: status open -> verified.
- 2026-10-28: Case SCRM-030 notes updated: expected to pass (bug set to verified by the user)..
- 2026-10-28: Retest passed: SCRM-030 in runs/2026-10-28_1155_staging_manual.
