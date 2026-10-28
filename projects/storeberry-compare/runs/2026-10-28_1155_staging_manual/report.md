# Run report: storeberry-compare / exploratory-2026-10-28-payment-recovery / staging

| Field | Value |
|---|---|
| Result | **FAIL (1 failed)** |
| Run | 2026-10-28_1155_staging_manual |
| Runner | manual |
| Base URL | https://storeberry-flower.stagingl10.storeberry.xyz/ |
| Started | 2026-10-28 11:55 |
| Duration | 0.7s |

## Summary

| Total | Pass | Fail | Flaky | Blocked | Skipped |
|---:|---:|---:|---:|---:|---:|
| 2 | 1 | 1 | 0 | 0 | 0 |

## Results

| ID | Title | Status | Checks | Time | Notes | Evidence |
|---|---|---|---|---|---|---|
| SBF-031 | Customer can re-upload a receipt after it is denied and the order returns to Payment Review | pass | - | 0.0s | - | - |
| SBF-035 | After a receipt is denied, Upload Receipt tells the customer it was rejected and asks for a new one | fail | - | 0.0s | product-bug; BUG-022 | [1](screenshots/SBF-035-m01-01-rejected-still-says-waiting-for-approval.png) |

## Failures and warnings

### SBF-035: After a receipt is denied, Upload Receipt tells the customer it was rejected and asks for a new one (fail)

- Failure type: product-bug (bug BUG-022)
- Source: `projects/storeberry-compare/cases/account/SBF-035-after-a-receipt-is-denied-upload.md`
- Note: After each deny the Upload Receipt tab still said 'successfully uploaded, and waiting for approval'; Order Detail STATUS Rejected.

![SBF-035](screenshots/SBF-035-m01-01-rejected-still-says-waiting-for-approval.png)
