# Run report: htx-lims-mobile / playwright / staging

| Field | Value |
|---|---|
| Result | **FAIL (1 failed)** |
| Run | 2026-11-18_1541_staging_playwright |
| Runner | playwright |
| Base URL | https://htx.eastus.cloudapp.azure.com:5001/ |
| Started | 2026-11-18 15:41 |
| Duration | 1m 1s |

## Summary

| Total | Pass | Fail | Flaky | Blocked | Skipped |
|---:|---:|---:|---:|---:|---:|
| 1 | 0 | 1 | 0 | 0 | 0 |

## Results

| ID | Title | Status | Checks | Time | Notes | Evidence |
|---|---|---|---|---|---|---|
| HLM-011 | a new item is received on the handheld: pre check-in and check-in | fail | 11/12 | 57.3s | untriaged | [1](screenshots/HLM-011-a1-1.png) [2](traces/HLM-011-a1-3.zip) |

## Failures and warnings

### HLM-011: a new item is received on the handheld: pre check-in and check-in (fail)

- Failure type: untriaged
- Source: `projects/htx-lims-mobile/tests/e2e/flows/item-lifecycle.spec.ts`
- Failed: Step: 1. Web: register a Consumable and print its tag on printer "test" (actual: `TimeoutError: locator.selectOption: Timeout 15000ms exceeded. Call log:   - waiting for getByLabel('Printer')`)
- Error: TimeoutError: locator.selectOption: Timeout 15000ms exceeded. Call log:   - waiting for getByLabel('Printer')     - locator resolved to <select class="form-select" id="selected_device" onchange="onDeviceSelected(this);"></select>   - attempting select option action     2 × waiting for element to be visible and enabled       - did not find some options     - retrying select option action     - wai…

![HLM-011](screenshots/HLM-011-a1-1.png)

## Notes

Playwright project "htx-lims-mobile". Full Playwright HTML report: reports/playwright-html/index.html, open with npm run report (overwritten by the next run).
