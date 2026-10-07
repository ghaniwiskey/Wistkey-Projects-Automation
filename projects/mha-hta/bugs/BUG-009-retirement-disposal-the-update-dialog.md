---
id: BUG-009
title: "Retirement/Disposal: the Update dialog pre-fills a wrong disposal date (31-Dec-2027 shows as 07/12/2029)"
severity: major
status: wont-fix
env: staging
url: https://mhauatwebhta.southeastasia.cloudapp.azure.com/Asset/Retirement
found: 2026-10-07
foundBy: "SPF-vs-HTA recheck (Aside)"
tests: []
frequency: always
---
## Summary
After a disposal date is saved, opening the pencil again pre-fills the date field with a different date: day and month are read the wrong way round and the month overflows (31/12/2027 read as month 31). Submitting the dialog without touching the date saves the wrong date. Same defect as mha-spf BUG-005 (there closed as wont-fix: accepted behaviour).

## Steps to reproduce
1. Log in as the HTA test account, role Logistics Officer 1
2. Asset > Retirement/Disposal: pencil on a RETIRED asset with no disposal date (402000003496)
3. Pick 31 Dec 2027 and Submit ("Updating done"); the row shows Disposal Date 31-Dec-2027
4. Click the same pencil again

## Expected
The Disposal Date field shows the saved date, 12/31/2027.

## Actual
The field shows 07/12/2029 (reproduced on HTA 2026-10-07, same values as on SPF). The date was cleared again afterwards (empty Submit, "Updating done"), so the asset is back to no disposal date.

## Evidence
- Same as mha-spf BUG-005 (screenshot in projects/mha-spf/bugs + explorations/2026-10-06-uncovered-flows)

## Environment
- Base URL: https://mhauatwebhta.southeastasia.cloudapp.azure.com/Asset/Retirement
- Env: staging

## History
- 2026-10-07: filed from the SPF-vs-HTA recheck; served as wont-fix like mha-spf BUG-005 (accepted behaviour). HTA-032 never checks the pre-filled value and always picks the date before submitting.
