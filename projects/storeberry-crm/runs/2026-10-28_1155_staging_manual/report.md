# Run report: storeberry-crm / exploratory-2026-10-28-fix-retests / staging

| Field | Value |
|---|---|
| Result | **FAIL (2 failed)** |
| Run | 2026-10-28_1155_staging_manual |
| Runner | manual |
| Base URL | https://www.stagingl10.storeberry.xyz/ |
| Started | 2026-10-28 11:55 |
| Duration | 2.0s |

## Summary

| Total | Pass | Fail | Flaky | Blocked | Skipped |
|---:|---:|---:|---:|---:|---:|
| 5 | 3 | 2 | 0 | 0 | 0 |

## Results

| ID | Title | Status | Checks | Time | Notes | Evidence |
|---|---|---|---|---|---|---|
| SCRM-030 | Completed stock take records variances and updates inventory | pass | - | 0.0s | - | - |
| SCRM-092 | Staff creates an online store order via Add Order (WebPOS) with store pickup | pass | - | 0.0s | - | - |
| SCRM-095 | Warehouse Users panel shows the users already mapped to the warehouse | pass | - | 0.0s | - | - |
| SCRM-135 | Stock take job keeps the quantity visibility chosen at creation (Open count) | fail | - | 0.0s | product-bug; BUG-030 | [1](screenshots/SCRM-135-m01-01-open-count-job-runs-blind.png) |
| SCRM-136 | Stock take job times are shown in local (HKT) time everywhere | fail | - | 0.0s | product-bug; BUG-031 | [1](screenshots/SCRM-136-m01-02-stock-take-created-at-utc.png) |

## Failures and warnings

### SCRM-135: Stock take job keeps the quantity visibility chosen at creation (Open count) (fail)

- Failure type: product-bug (bug BUG-030)
- Source: `projects/storeberry-crm/cases/inventory/SCRM-135-stock-take-job-keeps-the-quantity.md`
- Note: Open count chosen and shown on Review; job #19 counts in Blind count. Job cancelled.

![SCRM-135](screenshots/SCRM-135-m01-01-open-count-job-runs-blind.png)

### SCRM-136: Stock take job times are shown in local (HKT) time everywhere (fail)

- Failure type: product-bug (bug BUG-031)
- Source: `projects/storeberry-crm/cases/inventory/SCRM-136-stock-take-job-times-are-shown-in-local.md`
- Note: Job #18 Created At 04:50 (list and detail) vs snapshot 12:51 and history 12:52:05.

![SCRM-136](screenshots/SCRM-136-m01-02-stock-take-created-at-utc.png)
