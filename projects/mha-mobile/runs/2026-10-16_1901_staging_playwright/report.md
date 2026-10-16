# Run report: mha-mobile / playwright / staging

| Field | Value |
|---|---|
| Result | **FAIL (1 failed)** |
| Run | 2026-10-16_1901_staging_playwright |
| Runner | playwright |
| Base URL | https://mhauatweb.southeastasia.cloudapp.azure.com/ |
| Started | 2026-10-16 19:01 |
| Duration | 45.7s |

## Summary

| Total | Pass | Fail | Flaky | Blocked | Skipped |
|---:|---:|---:|---:|---:|---:|
| 1 | 0 | 1 | 0 | 0 | 0 |

## Results

| ID | Title | Status | Checks | Time | Notes | Evidence |
|---|---|---|---|---|---|---|
| MHM-023 | asset registration form pre-fills the asset's location remarks | fail | - | 45.0s | untriaged | [1](traces/MHM-023-a1-1.zip) |

## Failures and warnings

### MHM-023: asset registration form pre-fills the asset's location remarks (fail)

- Failure type: untriaged
- Source: `projects/mha-mobile/tests/e2e/registration/registration.spec.ts`
- Error: Error: page.goto: net::ERR_CONNECTION_TIMED_OUT at https://mhauatweb.southeastasia.cloudapp.azure.com/ Call log:   - navigating to "https://mhauatweb.southeastasia.cloudapp.azure.com/", waiting until "load" 

## Notes

Playwright project "mha-mobile". Full Playwright HTML report: reports/playwright-html/index.html, open with npm run report (overwritten by the next run).
