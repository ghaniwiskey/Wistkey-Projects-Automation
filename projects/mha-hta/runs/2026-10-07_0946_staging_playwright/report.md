# Run report: mha-hta / playwright / staging

| Field | Value |
|---|---|
| Result | **PASS** |
| Run | 2026-10-07_0946_staging_playwright |
| Runner | playwright |
| Base URL | https://mhauatwebhta.southeastasia.cloudapp.azure.com/ |
| Started | 2026-10-07 09:46 |
| Duration | 1m 49s |

## Summary

| Total | Pass | Fail | Flaky | Blocked | Skipped |
|---:|---:|---:|---:|---:|---:|
| 8 | 8 | 0 | 0 | 0 | 0 |

## Results

| ID | Title | Status | Checks | Time | Notes | Evidence |
|---|---|---|---|---|---|---|
| HTA-007 | logs1 walks the relocate wizard up to the location step | pass | 30/30 | 4.8s | - | - |
| HTA-008 | logs1 relocates an asset and the relocation is auto-approved | pass | 44/44 | 12.4s | - | - |
| HTA-022 | logs1 creates a one-off ad hoc stocktake, records a result and assigns a stocktaker | pass | 81/81 | 13.2s | - | - |
| HTA-023 | logs1 creates a periodic ad hoc stocktake and cancels it with a reason | pass | 42/44 | 12.6s | BUG-002 | - |
| HTA-036 | vet ic imports a working result file and the assets become sighted / working | pass | 53/53 | 23.1s | - | - |
| HTA-037 | fave import template downloads the lmsassetid template | pass | 14/16 | 14.3s | BUG-003 | - |
| HTA-048 | role period is saved with the dates picked in the calendar | pass | 15/16 | 19.1s | BUG-004 | - |
| HTA-051 | cost centre search finds a cost centre by its description | pass | 12/14 | 8.7s | BUG-001 | - |

## Notes

Playwright project "mha-hta". Full Playwright HTML report: reports/playwright-html/index.html, open with npm run report (overwritten by the next run).
