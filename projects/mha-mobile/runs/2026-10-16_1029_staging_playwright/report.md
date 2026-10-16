# Run report: mha-mobile / playwright / staging

| Field | Value |
|---|---|
| Result | **PASS** |
| Run | 2026-10-16_1029_staging_playwright |
| Runner | playwright |
| Base URL | https://mhauatweb.southeastasia.cloudapp.azure.com/ |
| Started | 2026-10-16 10:29 |
| Duration | 6m 43s |

## Summary

| Total | Pass | Fail | Flaky | Blocked | Skipped |
|---:|---:|---:|---:|---:|---:|
| 6 | 6 | 0 | 0 | 0 | 0 |

## Results

| ID | Title | Status | Checks | Time | Notes | Evidence |
|---|---|---|---|---|---|---|
| MHM-001 | home page loads | pass | 5/5 | 1.3s | - | - |
| MHM-002 | stocktaker logs in on the mobile app with the account from .env | pass | 32/32 | 12.1s | - | - |
| MHM-003 | login with an unknown username is refused | pass | 27/27 | 10.7s | - | - |
| MHM-004 | switching to stocktaker and a cost centre shows only that cost centre's stocktakes | pass | 43/43 | 1m 29s | - | - |
| MHM-005 | fave sighting submitted on the mobile app shows in mha web | pass | 89/89 | 1m 50s | - | - |
| MHM-006 | search asset shows the same asset data as mha web | pass | 100/100 | 2m 53s | - | - |

## Notes

Playwright project "mha-mobile". Full Playwright HTML report: reports/playwright-html/index.html, open with npm run report (overwritten by the next run).
