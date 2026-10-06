# Run report: mha-spf / playwright / staging

| Field | Value |
|---|---|
| Result | **PASS** |
| Run | 2026-10-06_1511_staging_playwright |
| Runner | playwright |
| Base URL | https://mhauatweb.southeastasia.cloudapp.azure.com/ |
| Started | 2026-10-06 15:11 |
| Duration | 2m 26s |

## Summary

| Total | Pass | Fail | Flaky | Blocked | Skipped |
|---:|---:|---:|---:|---:|---:|
| 11 | 11 | 0 | 0 | 0 | 0 |

## Results

| ID | Title | Status | Checks | Time | Notes | Evidence |
|---|---|---|---|---|---|---|
| SPF-028 | logs1 assigns and relocates an asset to a falo in one transaction | pass | 46/46 | 17.9s | - | - |
| SPF-029 | logs1 reprints an rfid tag without a printer and the asset is listed as failed | pass | 30/30 | 7.7s | - | - |
| SPF-030 | print tag reason is required and others needs remarks of at most 200 characters | pass | 27/27 | 5.6s | - | - |
| SPF-031 | logs1 sets a future disposal date on a retired asset, which stays retired until that date | pass | 43/43 | 12.1s | - | - |
| SPF-032 | the disposal date dialog shows the saved disposal date | pass | 34/36 | 16.7s | BUG-005 | - |
| SPF-033 | logs1 uploads a photo to an asset and deletes it | pass | 37/37 | 11.0s | - | - |
| SPF-034 | a sensitive asset (asset sensitivity yes) cannot get new photos | pass | 33/33 | 10.4s | - | - |
| SPF-035 | logs1 creates, edits and deletes a group | pass | 55/55 | 9.4s | - | - |
| SPF-036 | vet ic imports a working result file and the assets become sighted / working | pass | 48/50 | 28.8s | BUG-007 | - |
| SPF-037 | fave import template downloads the lmsassetid template | pass | 14/16 | 16.4s | BUG-006 | - |
| SPF-038 | the unit reports (summary, aging, rejection, retirement, new asset, loan, maintenance) export to excel | pass | 57/57 | 8.8s | - | - |

## Notes

Playwright project "mha-spf". Full Playwright HTML report: reports/playwright-html/index.html, open with npm run report (overwritten by the next run).
