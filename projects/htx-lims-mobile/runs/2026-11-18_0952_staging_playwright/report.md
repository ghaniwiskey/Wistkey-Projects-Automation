# Run report: htx-lims-mobile / playwright / staging

| Field | Value |
|---|---|
| Result | **FAIL (1 failed)** |
| Run | 2026-11-18_0952_staging_playwright |
| Runner | playwright |
| Base URL | https://htx.eastus.cloudapp.azure.com:5001/ |
| Started | 2026-11-18 09:52 |
| Duration | 5m 11s |

## Summary

| Total | Pass | Fail | Flaky | Blocked | Skipped |
|---:|---:|---:|---:|---:|---:|
| 2 | 1 | 1 | 0 | 0 | 0 |

## Results

| ID | Title | Status | Checks | Time | Notes | Evidence |
|---|---|---|---|---|---|---|
| HLM-001 | app opens on the Dashboard with every task tile | pass | 19/19 | 2m 3s | - | - |
| HLM-002 | sign in with the .env account downloads the device data and opens the Dashboard | fail | 22/24 | 3m 0s | untriaged | [1](traces/HLM-002-a1-2.zip) |

## Failures and warnings

### HLM-002: sign in with the .env account downloads the device data and opens the Dashboard (fail)

- Failure type: untriaged
- Source: `projects/htx-lims-mobile/tests/e2e/auth/login.spec.ts`
- Failed: Step: 2. Sign in: "Data downloaded" dialog, OK, Dashboard (actual: `ExpectError: WebSocket connection closed (code=1005, reason=no reason)`)
- Failed: Step: expect.toBeVisible() (actual: `ExpectError: WebSocket connection closed (code=1005, reason=no reason)`)
- Error: Test timeout of 180000ms exceeded.

## Notes

Playwright project "htx-lims-mobile". Full Playwright HTML report: reports/playwright-html/index.html, open with npm run report (overwritten by the next run).
