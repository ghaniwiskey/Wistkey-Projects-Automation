# Run report: htx-lims-mobile / playwright / staging

| Field | Value |
|---|---|
| Result | **FAIL (1 failed)** |
| Run | 2026-11-18_1540_staging_playwright |
| Runner | playwright |
| Base URL | https://htx.eastus.cloudapp.azure.com:5001/ |
| Started | 2026-11-18 15:40 |
| Duration | 1m 7s |

## Summary

| Total | Pass | Fail | Flaky | Blocked | Skipped |
|---:|---:|---:|---:|---:|---:|
| 1 | 0 | 1 | 0 | 0 | 0 |

## Results

| ID | Title | Status | Checks | Time | Notes | Evidence |
|---|---|---|---|---|---|---|
| HLM-011 | a new item is received on the handheld: pre check-in and check-in | fail | 1/3 | 1m 2s | untriaged | [1](screenshots/HLM-011-a1-1.png) [2](traces/HLM-011-a1-3.zip) |

## Failures and warnings

### HLM-011: a new item is received on the handheld: pre check-in and check-in (fail)

- Failure type: untriaged
- Source: `projects/htx-lims-mobile/tests/e2e/flows/item-lifecycle.spec.ts`
- Failed: Step: 1. Web: register a Consumable and print its tag on printer "test" (actual: `Error: expect(locator).toHaveCount(expected) failed  Locator:  locator('main').getByText('Loading...')`)
- Failed: Expect "toHaveCount" (actual: `Error: expect(locator).toHaveCount(expected) failed  Locator:  locator('main').getByText('Loading...')`)
- Error: Error: expect(locator).toHaveCount(expected) failed  Locator:  locator('main').getByText('Loading...') Expected: 0 Received: 1 Timeout:  30000ms  Call log:   - Expect "toHaveCount" locator('main').getByText('Loading...') with timeout 30000ms   - waiting for locator('main').getByText('Loading...')     62 × locator resolved to 1 element        - unexpected value "1" 

![HLM-011](screenshots/HLM-011-a1-1.png)

## Notes

Playwright project "htx-lims-mobile". Full Playwright HTML report: reports/playwright-html/index.html, open with npm run report (overwritten by the next run).
