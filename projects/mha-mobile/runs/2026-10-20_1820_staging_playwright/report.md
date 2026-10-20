# Run report: mha-mobile / playwright / staging

| Field | Value |
|---|---|
| Result | **PASS** |
| Run | 2026-10-20_1820_staging_playwright |
| Runner | playwright |
| Base URL | https://mhauatweb.southeastasia.cloudapp.azure.com/ |
| Started | 2026-10-20 18:20 |
| Duration | 19m 46s |

## Summary

| Total | Pass | Fail | Flaky | Blocked | Skipped |
|---:|---:|---:|---:|---:|---:|
| 6 | 5 | 0 | 1 | 0 | 0 |

## Results

| ID | Title | Status | Checks | Time | Notes | Evidence |
|---|---|---|---|---|---|---|
| MHM-004 | switching to stocktaker and a cost centre shows only that cost centre's stocktakes | pass | 39/39 | 1m 27s | - | - |
| MHM-006 | search asset shows the same asset data as mha web | pass | 95/95 | 1m 49s | - | - |
| MHM-010 | new asset reported on the mobile app shows on mha web | pass | 101/101 | 2m 43s | - | - |
| MHM-013 | asset registration completes a progress asset from the phone | pass | 85/85 | 1m 48s | - | - |
| MHM-018 | fave sighting at a wrong location on the mobile app raises a relocation for logs1 | flaky | 118/118 | 7m 41s | attempt 2 | [1](traces/MHM-018-a1-2.zip) |
| MHM-024 | switch role offers only the cost centres of the role picked in the panel | pass | 58/60 | 4m 1s | BUG-005 | - |

## Failures and warnings

### MHM-018: fave sighting at a wrong location on the mobile app raises a relocation for logs1 (flaky)

- Source: `projects/mha-mobile/tests/e2e/stocktake/fave-outcomes.spec.ts`
- Earlier attempt: fail (failed: Step: 4. MHA web (VET IC): SIGHTED, Correct Location unticked, Location Status OPEN)

## Notes

Playwright project "mha-mobile". Full Playwright HTML report: reports/playwright-html/index.html, open with npm run report (overwritten by the next run).
