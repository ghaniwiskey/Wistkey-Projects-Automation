# Run report: mha-spf / smoke-login / staging

| Field | Value |
|---|---|
| Result | **PASS** |
| Run | 2026-10-05_1147_staging_smoke-login |
| Runner | aside-agentic |
| Base URL | https://mhauatweb.southeastasia.cloudapp.azure.com/ |
| Started | 2026-10-05 11:47 |
| Duration | 1m 12s |

## Summary

| Total | Pass | Fail | Flaky | Blocked | Skipped |
|---:|---:|---:|---:|---:|---:|
| 1 | 1 | 0 | 0 | 0 | 0 |

## Results

| ID | Title | Status | Checks | Time | Notes | Evidence |
|---|---|---|---|---|---|---|
| SPF-001 | Log in with the passwordless test account | pass | 17/17 | 4.7s | - | - |

## Notes

First run on MHA SPF staging. Context updates: login path /Account/LoginBk, post-login /IndexBk, header/Role/side-menu locators, SPF-A2216GA = Wong Pui Lai Annie with 6 roles. One earlier attempt discarded with qa.forget (automation error: heading lookups).
