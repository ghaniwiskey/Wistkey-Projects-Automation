# Run report: htx-lims-mobile / playwright / staging

| Field | Value |
|---|---|
| Result | **FAIL (2 failed)** |
| Run | 2026-11-18_0959_staging_playwright |
| Runner | playwright |
| Base URL | https://htx.eastus.cloudapp.azure.com:5001/ |
| Started | 2026-11-18 09:59 |
| Duration | 3m 47s |

## Summary

| Total | Pass | Fail | Flaky | Blocked | Skipped |
|---:|---:|---:|---:|---:|---:|
| 2 | 0 | 2 | 0 | 0 | 0 |

## Results

| ID | Title | Status | Checks | Time | Notes | Evidence |
|---|---|---|---|---|---|---|
| HLM-001 | app opens on the Dashboard with every task tile | fail | 3/4 | 41.2s | untriaged | [1](traces/HLM-001-a1-2.zip) |
| HLM-002 | sign in with the .env account downloads the device data and opens the Dashboard | fail | 21/22 | 3m 0s | untriaged | [1](traces/HLM-002-a1-2.zip) |

## Failures and warnings

### HLM-001: app opens on the Dashboard with every task tile (fail)

- Failure type: untriaged
- Source: `projects/htx-lims-mobile/tests/e2e/smoke/dashboard.spec.ts`
- Failed: Step: 2. The Data update card and every task tile are shown (actual: `TypeError: _pages.expect.arrayContaining is not a function`)
- Error: TypeError: _pages.expect.arrayContaining is not a function

### HLM-002: sign in with the .env account downloads the device data and opens the Dashboard (fail)

- Failure type: untriaged
- Source: `projects/htx-lims-mobile/tests/e2e/auth/login.spec.ts`
- Failed: Step: 2. Sign in: "Data downloaded" dialog, OK, Dashboard (actual: `Error: WebSocket connection closed (code=1005, reason=no reason)`)
- Error: Test timeout of 180000ms exceeded.

## Notes

Playwright project "htx-lims-mobile". Full Playwright HTML report: reports/playwright-html/index.html, open with npm run report (overwritten by the next run).
