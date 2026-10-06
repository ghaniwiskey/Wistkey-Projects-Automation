# Run report: mha-spf / playwright / staging

| Field | Value |
|---|---|
| Result | **PASS** |
| Run | 2026-10-06_1720_staging_playwright |
| Runner | playwright |
| Base URL | https://mhauatweb.southeastasia.cloudapp.azure.com/ |
| Started | 2026-10-06 17:20 |
| Duration | 1m 22s |

## Summary

| Total | Pass | Fail | Flaky | Blocked | Skipped |
|---:|---:|---:|---:|---:|---:|
| 9 | 9 | 0 | 0 | 0 | 0 |

## Results

| ID | Title | Status | Checks | Time | Notes | Evidence |
|---|---|---|---|---|---|---|
| SPF-044 | agency admin creates a user in user listing | pass | 48/48 | 9.6s | - | - |
| SPF-045 | agency admin assigns a user to a role, the user logs in with it, and the role is removed again | pass | 51/51 | 13.1s | - | - |
| SPF-046 | a user set to inactive in user listing can no longer log in | pass | 20/20 | 6.3s | - | - |
| SPF-047 | role period dialog checks required dates and the date order | pass | 27/27 | 5.1s | - | - |
| SPF-048 | role period is saved with the dates picked in the calendar | pass | 15/16 | 18.5s | BUG-011 | - |
| SPF-049 | a header announcement for today shows on the login page | pass | 33/33 | 8.0s | - | - |
| SPF-050 | agency admin updates a cost centre and name is required | pass | 26/26 | 6.4s | - | - |
| SPF-051 | cost centre search finds a cost centre by its description | pass | 13/15 | 8.9s | BUG-012 | - |
| SPF-052 | agency admin updates an email template and subject is required | pass | 24/24 | 5.2s | - | - |

## Notes

Playwright project "mha-spf". Full Playwright HTML report: reports/playwright-html/index.html, open with npm run report (overwritten by the next run).
