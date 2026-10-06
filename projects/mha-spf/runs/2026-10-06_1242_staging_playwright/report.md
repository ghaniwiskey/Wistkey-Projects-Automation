# Run report: mha-spf / playwright / staging

| Field | Value |
|---|---|
| Result | **PASS** |
| Run | 2026-10-06_1242_staging_playwright |
| Runner | playwright |
| Base URL | https://mhauatweb.southeastasia.cloudapp.azure.com/ |
| Started | 2026-10-06 12:42 |
| Duration | 3m 8s |

## Summary

| Total | Pass | Fail | Flaky | Blocked | Skipped |
|---:|---:|---:|---:|---:|---:|
| 12 | 12 | 0 | 0 | 0 | 0 |

## Results

| ID | Title | Status | Checks | Time | Notes | Evidence |
|---|---|---|---|---|---|---|
| SPF-004 | logs1 finds an asset by asset id in asset listing | pass | 14/14 | 8.2s | - | - |
| SPF-006 | asset details show the asset header and the data tabs | pass | 31/31 | 9.2s | - | - |
| SPF-007 | logs1 walks the relocate wizard up to the location step | pass | 29/29 | 6.3s | - | - |
| SPF-008 | logs1 relocates an asset and the relocation is auto-approved | pass | 42/42 | 18.6s | - | - |
| SPF-009 | logs1 assigns an asset to a falo and it is auto-approved | pass | 42/42 | 14.3s | - | - |
| SPF-010 | falo returns an asset to logs1 and logs1 approves it | pass | 78/78 | 27.5s | - | - |
| SPF-011 | logs1 rejects a falo return with a reason | pass | 60/60 | 22.3s | - | - |
| SPF-012 | owner cancels a submitted assignment with a reason | pass | 54/54 | 17.8s | - | - |
| SPF-018 | logs1 recalls an asset from another falo and the uro approval clears the falo | pass | 80/80 | 29.1s | - | - |
| SPF-022 | logs1 creates a one-off ad hoc stocktake, records a result and assigns a stocktaker | pass | 77/77 | 13.2s | - | - |
| SPF-023 | logs1 creates a periodic ad hoc stocktake and cancels it with a reason | pass | 42/44 | 13.3s | BUG-001 | - |
| SPF-024 | asset listing (detailed) report filters the unit's assets and exports them to excel | pass | 18/18 | 6.8s | - | - |

## Notes

Playwright project "mha-spf". Full Playwright HTML report: reports/playwright-html/index.html, open with npm run report (overwritten by the next run).
