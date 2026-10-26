# Run report: storeberry-crm / playwright / staging

| Field | Value |
|---|---|
| Result | **FAIL (2 failed)** |
| Run | 2026-10-26_0920_staging_playwright-2 |
| Runner | playwright |
| Base URL | https://www.stagingl10.storeberry.xyz/ |
| Started | 2026-10-26 09:20 |
| Duration | 42.3s |

## Summary

| Total | Pass | Fail | Flaky | Blocked | Skipped |
|---:|---:|---:|---:|---:|---:|
| 4 | 2 | 2 | 0 | 0 | 0 |

## Results

| ID | Title | Status | Checks | Time | Notes | Evidence |
|---|---|---|---|---|---|---|
| SCRM-001 | CRM login page loads with sign-in controls | pass | 14/14 | 2.1s | - | - |
| SCRM-003 | pending payment filter shows matching CRM orders | fail | 1/2 | 21.9s | test-issue | - |
| SCRM-004 | CRM customer list loads with search controls | fail | 1/3 | 13.4s | test-issue | - |
| SCRM-005 | store admin signs in to Storeberry Flower CRM | pass | 13/13 | 3.7s | - | - |

## Failures and warnings

### SCRM-003: pending payment filter shows matching CRM orders (fail)

- Failure type: test-issue
- Source: `projects/storeberry-crm/tests/e2e/orders/pending-payment.spec.ts`
- Failed: Step: 1. Open Orders and record the last-12-month order count (actual: `TimeoutError: locator.click: Timeout 15000ms exceeded. Call log:   - waiting for getByRole('link', { name: 'Orders', exact: true })`)
- Error: TimeoutError: locator.click: Timeout 15000ms exceeded. Call log:   - waiting for getByRole('link', { name: 'Orders', exact: true })
- Note: Orders navigation included an icon in its accessible name; use the observed direct route and flexible dynamic count.

### SCRM-004: CRM customer list loads with search controls (fail)

- Failure type: test-issue
- Source: `projects/storeberry-crm/tests/e2e/customers/search.spec.ts`
- Failed: Step: 1. Open the customer list and confirm it loads (actual: `Error: expect(locator).toHaveText(expected) failed  Locator: getByText(/^No\. of Customer:\s*\d+$/)`)
- Failed: Expect "toHaveText" (actual: `Error: expect(locator).toHaveText(expected) failed  Locator: getByText(/^No\. of Customer:\s*\d+$/)`)
- Error: Error: expect(locator).toHaveText(expected) failed  Locator: getByText(/^No\. of Customer:\s*\d+$/) Expected pattern: /^No\. of Customer:\s*\d+$/ Timeout: 5000ms Error: element(s) not found  Call log:   - Expect "toHaveText" getByText(/^No\. of Customer:\s*\d+$/) with timeout 5000ms   - waiting for getByText(/^No\. of Customer:\s*\d+$/)
- Note: Customer count locator was too strict for page timing/text; relaxed it and increased the list-ready timeout.

## Notes

Playwright project "storeberry-crm". Full Playwright HTML report: reports/playwright-html/index.html, open with npm run report (overwritten by the next run).
