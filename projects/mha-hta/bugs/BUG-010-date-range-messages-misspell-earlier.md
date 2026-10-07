---
id: BUG-010
title: "Date range messages misspell \"earlier\": \"The start date must be ealier than the end date\""
severity: trivial
status: open
env: staging
url: https://mhauatwebhta.southeastasia.cloudapp.azure.com/User/Role
found: 2026-10-07
foundBy: "HTA-047 run (Aside)"
tests: [HTA-047]
frequency: always
---
## Summary
Typo in the start/end date validation of User > Role Listing > Periods (the same wording is used by Settings > Announcement). Same defect as mha-spf BUG-015.

## Steps to reproduce
1. As Agency Admin, User > Role Listing > Stocktaker > Periods > Add Period
2. Pick a Start Date after the End Date, click Submit

## Expected
"The start date must be earlier than the end date"

## Actual
"The start date must be ealier than the end date" (the end date message is spelled correctly). Seen on HTA in every HTA-047 run (the test asserts this exact text, 2026-10-07), same as on SPF.

## Evidence
-

## Environment
- Base URL: https://mhauatwebhta.southeastasia.cloudapp.azure.com/User/Role
- Env: staging

## History
- 2026-10-07: filed from the SPF-vs-HTA recheck; same as mha-spf BUG-015.
