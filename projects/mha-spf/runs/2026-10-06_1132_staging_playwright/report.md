# Run report: mha-spf / playwright / staging

| Field | Value |
|---|---|
| Result | **PASS** |
| Run | 2026-10-06_1132_staging_playwright |
| Runner | playwright |
| Base URL | https://mhauatweb.southeastasia.cloudapp.azure.com/ |
| Started | 2026-10-06 11:32 |
| Duration | 4m 39s |

## Summary

| Total | Pass | Fail | Flaky | Blocked | Skipped |
|---:|---:|---:|---:|---:|---:|
| 24 | 24 | 0 | 0 | 0 | 0 |

## Results

| ID | Title | Status | Checks | Time | Notes | Evidence |
|---|---|---|---|---|---|---|
| SPF-001 | log in with the passwordless test account | pass | 23/23 | 2.5s | - | - |
| SPF-002 | switch the active role from the header role dropdown | pass | 19/19 | 5.0s | - | - |
| SPF-003 | log out ends access to protected pages | pass | 10/10 | 4.8s | - | - |
| SPF-004 | logs1 finds an asset by asset id in asset listing | pass | 14/14 | 5.1s | - | - |
| SPF-005 | logs1 filters asset listing by status | pass | 17/17 | 5.9s | - | - |
| SPF-006 | asset details show the asset header and the data tabs | pass | 31/31 | 5.5s | - | - |
| SPF-007 | logs1 walks the relocate wizard up to the location step | pass | 29/29 | 6.7s | - | - |
| SPF-008 | logs1 relocates an asset and the relocation is auto-approved | pass | 42/42 | 19.6s | - | - |
| SPF-009 | logs1 assigns an asset to a falo and it is auto-approved | pass | 42/42 | 16.7s | - | - |
| SPF-010 | falo returns an asset to logs1 and logs1 approves it | pass | 78/78 | 25.7s | - | - |
| SPF-011 | logs1 rejects a falo return with a reason | pass | 60/60 | 21.3s | - | - |
| SPF-012 | owner cancels a submitted assignment with a reason | pass | 54/54 | 18.4s | - | - |
| SPF-013 | logs1 registers a new asset with a complete location | pass | 29/29 | 10.7s | - | - |
| SPF-014 | partial registration sets progress and complete register finishes it | pass | 45/45 | 15.3s | - | - |
| SPF-015 | reject a new asset from registration and reinstate it | pass | 34/34 | 9.9s | - | - |
| SPF-016 | report a potential new asset and close it as logs1 | pass | 45/45 | 13.3s | - | - |
| SPF-017 | report a potential new asset and cancel it | pass | 34/34 | 8.9s | - | - |
| SPF-018 | logs1 recalls an asset from another falo and the uro approval clears the falo | pass | 79/79 | 27.3s | - | - |
| SPF-019 | vet ic views the active fave for a unit and exports it | pass | 31/31 | 5.0s | - | - |
| SPF-020 | vet ic updates a fave sighting result and htd follow-up is auto-mapped | pass | 56/56 | 9.5s | - | - |
| SPF-021 | vet ic assigns a stocktaker to a fave asset | pass | 47/47 | 10.2s | - | - |
| SPF-022 | logs1 creates a one-off ad hoc stocktake, records a result and assigns a stocktaker | pass | 72/72 | 10.2s | - | - |
| SPF-023 | logs1 creates a periodic ad hoc stocktake and cancels it with a reason | pass | 41/43 | 12.6s | BUG-001 | - |
| SPF-024 | asset listing (detailed) report filters the unit's assets and exports them to excel | pass | 18/18 | 7.0s | - | - |

## Notes

Playwright project "mha-spf". Full Playwright HTML report: reports/playwright-html/index.html, open with npm run report (overwritten by the next run).
