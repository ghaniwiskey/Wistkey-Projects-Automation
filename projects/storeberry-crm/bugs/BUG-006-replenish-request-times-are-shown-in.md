---
id: BUG-006
title: "Replenish request times are shown in UTC while transfer orders show local time"
severity: minor
status: open
env: staging
url: "https://www.stagingl10.storeberry.xyz/inventory/replenish-request-detail?id=151"
updated: 2026-10-27T09:51:38.788Z
found: 2026-10-27
foundBy: "explorations/2026-10-27-crm-eshop-critical.md"
tests: []
frequency: always
---
## Summary
Replenish Request detail (Create Time, Request Date, Approve Date) shows times 8 hours behind the Transfer Order pages. Approving replenish request 151 created transfer 305 at the same moment, but the request shows Approve Date 2026-10-27 01:46:30 and the transfer shows Create Time 2026-10-27 09:46:30.

## Steps to reproduce
1. Open Inventory > Replenish Request > Request261027014240e688 (id 151)
2. Read Approve Date
3. Open the linked Transfer order Transfer261027014630fad0 (id 305) and read Create Time

## Expected
Both pages show the same local (store) time for the same event.

## Actual
Replenish request: Approve Date 01:46:30. Transfer order created by that approval: Create Time 09:46:30 (UTC+8). The record numbers also embed UTC (Request261027021544 shows Create Time 02:15:44).

## Evidence
- Replenish 153 Create Time 02:15:44 vs transfer 304 (Transfer261027014447) Create Time 09:44:47.

## Environment
- Base URL: https://www.stagingl10.storeberry.xyz/inventory/replenish-request-detail?id=151
- Env: staging

## History
- 2026-10-27: filed from explorations/2026-10-27-crm-eshop-critical.md in the Test Manager app.
- 2026-10-27: Still reproduces 2026-10-27 17:44 HKT: new request QA-RR-mvqi08o1 (id 155) lists 17:44:20 in the list but detail Create Time 09:44:20; its auto transfer number Transfer26102709445029e9 embeds UTC.
