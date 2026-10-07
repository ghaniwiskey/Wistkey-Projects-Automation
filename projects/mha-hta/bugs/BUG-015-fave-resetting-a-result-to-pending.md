---
id: BUG-015
title: "FAVE: resetting a result to PENDING after its relocation was approved says \"updated\" but changes nothing"
severity: minor
status: wont-fix
env: staging
url: https://mhauatwebhta.southeastasia.cloudapp.azure.com/Stocktake/Fave
found: 2026-10-07
foundBy: "SPF-vs-HTA recheck (Aside)"
tests: []
frequency: always
---
## Summary
After a FAVE asset is recorded as SIGHTED with an incorrect location and the resulting RELOCATE transaction is approved, the result is locked. Setting Sighted Result to PENDING shows the success message "The stocktake result is updated." and the result stays SIGHTED / WORKING. Same defect as mha-spf BUG-009 (there closed as wont-fix: accepted behaviour).

## Steps to reproduce
1. Log in as the HTA test account, role Verification Team IC/2IC, Stocktake > FAVE, cost centre 338202, Details
2. Asset 801000000150: Update Result, SIGHTED, WORKING, untick Correct Location, New Asset Location CLS / 698928, Block "Qx7k2m3n4p", Level "777", Room No "Q1a2b", Remarks "QA fave relocate check", Submit
3. Switch to Logistics Officer 1, Asset > Assignment, open the new RELOCATE transaction (ASG00000012) and Approve
4. Switch back to VET IC, open the FAVE Details, tick 801000000150, Update Result, pick Sighted Result PENDING, Submit
5. Reload the FAVE and search the asset

## Expected
Either the result goes back to PENDING, or the dialog refuses with a message (as it does for Correct Location: "Can't set the location correctly because it has already been approved.").

## Actual
"The stocktake result is updated." is shown, but after a reload the row still shows SIGHTED / WORKING / No Further Action / Working condition (reproduced on HTA 2026-10-07). Correct Location also gives "Can't set the location correctly because it has already been approved.".

## Evidence
- Verified by hand on HTA 2026-10-07 (asset 801000000150, ASG00000012)

## Environment
- Base URL: https://mhauatwebhta.southeastasia.cloudapp.azure.com/Stocktake/Fave
- Env: staging

## History
- 2026-10-07: filed from the SPF-vs-HTA recheck; served as wont-fix like mha-spf BUG-009 (accepted behaviour).
