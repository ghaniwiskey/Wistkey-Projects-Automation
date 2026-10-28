# Run report: storeberry-crm / exploratory-2026-10-28-refund-loyalty-stock / staging

| Field | Value |
|---|---|
| Result | **FAIL (1 failed)** |
| Run | 2026-10-28_1219_staging_manual |
| Runner | manual |
| Base URL | https://www.stagingl10.storeberry.xyz/ |
| Started | 2026-10-28 12:19 |
| Duration | 0.8s |

## Summary

| Total | Pass | Fail | Flaky | Blocked | Skipped |
|---:|---:|---:|---:|---:|---:|
| 3 | 2 | 1 | 0 | 0 | 0 |

## Results

| ID | Title | Status | Checks | Time | Notes | Evidence |
|---|---|---|---|---|---|---|
| SCRM-116 | A unit sold in Web POS is no longer available to the eShop when both sell from the same warehouse | pass | - | 0.0s | - | - |
| SCRM-118 | A second partial refund cannot exceed the amount still paid on the order | fail | - | 0.0s | product-bug; BUG-032 | [1](screenshots/SCRM-118-m01-03-refund-900-of-812-remaining.png) |
| SCRM-119 | Reaching the level spending threshold upgrades the member, gives the upgrade reward and the new level discount | pass | - | 0.0s | - | - |

## Failures and warnings

### SCRM-118: A second partial refund cannot exceed the amount still paid on the order (fail)

- Failure type: product-bug (bug BUG-032)
- Source: `projects/storeberry-crm/cases/orders/SCRM-118-a-second-partial-refund-cannot-exceed.md`
- Note: Refund edited to 900 on 812.50 remaining (TXN0126102800015) and 2100 on a 2088 order (TXN0126102800017) both completed.

![SCRM-118](screenshots/SCRM-118-m01-03-refund-900-of-812-remaining.png)
