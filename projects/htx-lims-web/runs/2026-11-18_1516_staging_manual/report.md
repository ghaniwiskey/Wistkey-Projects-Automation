# Run report: htx-lims-web / handheld-flows-2026-11-18 / staging

| Field | Value |
|---|---|
| Result | **PASS** |
| Run | 2026-11-18_1516_staging_manual |
| Runner | manual |
| Base URL | https://htx.eastus.cloudapp.azure.com:5001/ |
| Started | 2026-11-18 15:16 |
| Duration | 1.6s |

## Summary

| Total | Pass | Fail | Flaky | Blocked | Skipped |
|---:|---:|---:|---:|---:|---:|
| 6 | 6 | 0 | 0 | 0 | 0 |

## Results

| ID | Title | Status | Checks | Time | Notes | Evidence |
|---|---|---|---|---|---|---|
| HLW-024 | Chemical Usage lists chemicals first expiry first | pass | - | 0.0s | - | [1](screenshots/HLW-024-m01-hlw-024.png) |
| HLW-032 | A new item passes gantry 1a before check-in without an alert | pass | - | 0.0s | - | - |
| HLW-034 | A loaned item that comes back goes through pre check-in, count and check-in again | pass | - | 0.0s | - | [1](screenshots/HLW-034-m01-hlw-034-loanreport.png) |
| HLW-041 | Checking out a chemical out of FEFO order shows a warning | pass | - | 0.0s | - | [1](screenshots/HLW-041-m01-hlw-041.png) |
| HLW-047 | A stock take goes from Draft to Completed with handheld scan results | pass | - | 0.0s | - | [1](screenshots/HLW-047-m01-stocktake-flow.png) |
| HLW-048 | Stock-take adjustment disposes an item that was not located | pass | - | 0.0s | - | [1](screenshots/HLW-048-m01-stock-adjustment.png) |
