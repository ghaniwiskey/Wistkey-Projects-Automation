# Run report: mha-mobile / playwright / staging

| Field | Value |
|---|---|
| Result | **FAIL (1 failed)** |
| Run | 2026-10-16_1630_staging_playwright |
| Runner | playwright |
| Base URL | https://mhauatweb.southeastasia.cloudapp.azure.com/ |
| Started | 2026-10-16 16:30 |
| Duration | 5m 18s |

## Summary

| Total | Pass | Fail | Flaky | Blocked | Skipped |
|---:|---:|---:|---:|---:|---:|
| 1 | 0 | 1 | 0 | 0 | 0 |

## Results

| ID | Title | Status | Checks | Time | Notes | Evidence |
|---|---|---|---|---|---|---|
| MHM-022 | assign and relocate made on the mobile app is auto-approved on mha web | fail | 115/117 | 5m 14s | untriaged | [1](screenshots/MHM-022-a1-1.png) [2](traces/MHM-022-a1-3.zip) |

## Failures and warnings

### MHM-022: assign and relocate made on the mobile app is auto-approved on mha web (fail)

- Failure type: untriaged
- Source: `projects/mha-mobile/tests/e2e/assignment/assign.spec.ts`
- Failed: Step: 3. Phone: ASSIGN & RELOCATE to a FALO who is not the current one, Room QQW6W, remarks as they are, Complete (actual: `ExpectError: Expected element to have text "0", but no matching element was found`)
- Failed: Step: expect.toHaveText() (actual: `ExpectError: Expected element to have text "0", but no matching element was found`)
- Error: ExpectError: Expected element to have text "0", but no matching element was found

![MHM-022](screenshots/MHM-022-a1-1.png)

## Notes

Playwright project "mha-mobile". Full Playwright HTML report: reports/playwright-html/index.html, open with npm run report (overwritten by the next run).
