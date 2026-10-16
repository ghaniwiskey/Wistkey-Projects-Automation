# Run report: mha-mobile / playwright / staging

| Field | Value |
|---|---|
| Result | **FAIL (1 failed)** |
| Run | 2026-10-16_1006_staging_playwright |
| Runner | playwright |
| Base URL | https://mhauatweb.southeastasia.cloudapp.azure.com/ |
| Started | 2026-10-16 10:06 |
| Duration | 2m 2s |

## Summary

| Total | Pass | Fail | Flaky | Blocked | Skipped |
|---:|---:|---:|---:|---:|---:|
| 1 | 0 | 1 | 0 | 0 | 0 |

## Results

| ID | Title | Status | Checks | Time | Notes | Evidence |
|---|---|---|---|---|---|---|
| MHM-004 | switching to stocktaker and a cost centre shows only that cost centre's stocktakes | fail | 6/7 | 2m 0s | untriaged | [1](screenshots/MHM-004-a1-1.png) [2](traces/MHM-004-a1-3.zip) |

## Failures and warnings

### MHM-004: switching to stocktaker and a cost centre shows only that cost centre's stocktakes (fail)

- Failure type: untriaged
- Source: `projects/mha-mobile/tests/e2e/role/switch-role.spec.ts`
- Failed: Step: 1. Log in (fixture) and pick a cost centre other than the active one (actual: `Error: WebSocket connection closed (code=1005, reason=no reason)`)
- Error: Test timeout of 120000ms exceeded.

![MHM-004](screenshots/MHM-004-a1-1.png)

## Notes

Playwright project "mha-mobile". Full Playwright HTML report: reports/playwright-html/index.html, open with npm run report (overwritten by the next run).
