# Run report: mha-mobile / playwright / staging

| Field | Value |
|---|---|
| Result | **PASS** |
| Run | 2026-10-20_1501_staging_playwright |
| Runner | playwright |
| Base URL | https://mhauatweb.southeastasia.cloudapp.azure.com/ |
| Started | 2026-10-20 15:01 |
| Duration | 19m 53s |

## Summary

| Total | Pass | Fail | Flaky | Blocked | Skipped |
|---:|---:|---:|---:|---:|---:|
| 3 | 2 | 0 | 1 | 0 | 0 |

## Results

| ID | Title | Status | Checks | Time | Notes | Evidence |
|---|---|---|---|---|---|---|
| MHM-008 | relocation made on the mobile app is approved and moves the asset on mha web | pass | 131/132 | 5m 55s | - | - |
| MHM-012 | home tiles follow the active role | pass | 83/83 | 5m 6s | - | - |
| MHM-022 | assign and relocate made on the mobile app is auto-approved on mha web | flaky | 158/158 | 8m 4s | attempt 2 | [1](traces/MHM-022-a1-2.zip) |

## Failures and warnings

### MHM-022: assign and relocate made on the mobile app is auto-approved on mha web (flaky)

- Source: `projects/mha-mobile/tests/e2e/assignment/assign.spec.ts`
- Earlier attempt: fail

## Notes

Playwright project "mha-mobile". Full Playwright HTML report: reports/playwright-html/index.html, open with npm run report (overwritten by the next run).
