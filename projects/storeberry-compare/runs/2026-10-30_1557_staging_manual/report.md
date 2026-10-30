# Run report: storeberry-compare / last-unit-two-playwright-contexts / staging

| Field | Value |
|---|---|
| Result | **FAIL (1 failed)** |
| Run | 2026-10-30_1557_staging_manual |
| Runner | manual |
| Base URL | https://storeberry-flower.stagingl10.storeberry.xyz/ |
| Started | 2026-10-30 15:57 |
| Duration | 6m 16s |

## Summary

| Total | Pass | Fail | Flaky | Blocked | Skipped |
|---:|---:|---:|---:|---:|---:|
| 1 | 0 | 1 | 0 | 0 | 0 |

## Results

| ID | Title | Status | Checks | Time | Notes | Evidence |
|---|---|---|---|---|---|---|
| SBF-028 | Only one of two customers can buy the last unit of a product | fail | - | 0.0s | product-bug; BUG-023 | [1](screenshots/SBF-028-m01-02-negative-stock.png) [2](screenshots/SBF-028-m02-05-two-crm-orders.png) |

## Failures and warnings

### SBF-028: Only one of two customers can buy the last unit of a product (fail)

- Failure type: product-bug (bug BUG-023)
- Source: `projects/storeberry-compare/cases/checkout/SBF-028-only-one-of-two-customers-can-buy-the.md`
- Note: One approved concurrent attempt using two isolated Playwright guest contexts. Both orders TXN0126103000007 and TXN0126103000008 succeeded with initial TaiPo Available 1; available became -1. Product Pre-order was disabled. Both orders voided; stock restored to 1. No retry.

![SBF-028](screenshots/SBF-028-m02-05-two-crm-orders.png)
