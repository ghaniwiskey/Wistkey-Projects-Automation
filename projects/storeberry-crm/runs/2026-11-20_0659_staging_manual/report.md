# Run report: storeberry-crm / web-pos-membership-discount / staging

| Field | Value |
|---|---|
| Result | **PASS** |
| Run | 2026-11-20_0659_staging_manual |
| Runner | manual |
| Base URL | https://www.stagingl10.storeberry.xyz/ |
| Started | 2026-11-20 06:59 |
| Duration | 0.9s |

## Summary

| Total | Pass | Fail | Flaky | Blocked | Skipped |
|---:|---:|---:|---:|---:|---:|
| 2 | 2 | 0 | 0 | 0 | 0 |

## Results

| ID | Title | Status | Checks | Time | Notes | Evidence |
|---|---|---|---|---|---|---|
| SCRM-185 | Web POS applies the percentage discount only for the configured membership level | pass | - | 0.0s | - | [1](screenshots/SCRM-185-m01-01-level-3-discount.png) |
| SCRM-186 | Web POS excludes products flagged against whole-order promotions from the membership discount | pass | - | 0.0s | - | [1](screenshots/SCRM-186-m01-02-pinky-mixed-cart.png) |
