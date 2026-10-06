# Run report: mha-spf / playwright / staging

| Field | Value |
|---|---|
| Result | **PASS** |
| Run | 2026-10-06_1138_staging_playwright |
| Runner | playwright |
| Base URL | https://mhauatweb.southeastasia.cloudapp.azure.com/ |
| Started | 2026-10-06 11:38 |
| Duration | 57.7s |

## Summary

| Total | Pass | Fail | Flaky | Blocked | Skipped |
|---:|---:|---:|---:|---:|---:|
| 6 | 6 | 0 | 0 | 0 | 0 |

## Results

| ID | Title | Status | Checks | Time | Notes | Evidence |
|---|---|---|---|---|---|---|
| SPF-019 | vet ic views the active fave for a unit and exports it | pass | 31/31 | 5.3s | - | - |
| SPF-020 | vet ic updates a fave sighting result and htd follow-up is auto-mapped | pass | 56/56 | 9.7s | - | - |
| SPF-021 | vet ic assigns a stocktaker to a fave asset | pass | 47/47 | 10.0s | - | - |
| SPF-022 | logs1 creates a one-off ad hoc stocktake, records a result and assigns a stocktaker | pass | 72/72 | 10.3s | - | - |
| SPF-023 | logs1 creates a periodic ad hoc stocktake and cancels it with a reason | pass | 41/43 | 12.9s | BUG-001 | - |
| SPF-024 | asset listing (detailed) report filters the unit's assets and exports them to excel | pass | 18/18 | 8.7s | - | - |

## Notes

Playwright project "mha-spf". Full Playwright HTML report: reports/playwright-html/index.html, open with npm run report (overwritten by the next run).
