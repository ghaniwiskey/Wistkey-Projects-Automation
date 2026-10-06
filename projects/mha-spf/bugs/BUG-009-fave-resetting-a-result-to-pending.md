---
id: BUG-009
title: "FAVE: resetting a result to PENDING after its relocation was approved says \"updated\" but changes nothing"
severity: minor
status: open
env: staging
url: https://mhauatweb.southeastasia.cloudapp.azure.com/Stocktake/Fave
found: 2026-10-06
foundBy: "manual check of the FAVE relocation flow (2026-10-06)"
tests: [SPF-039]
frequency: always
---
## Summary
After a FAVE asset is recorded as SIGHTED with an incorrect location and the resulting RELOCATE transaction is approved, the result is locked. Setting Correct Location again is refused with a clear message, but setting Sighted Result to PENDING shows the success message "The stocktake result is updated." and the result stays SIGHTED / WORKING.

## Steps to reproduce
1. Log in as SPF-A2216GA, role Verification Team IC/2IC, Stocktake > FAVE > FAVE FY26-2007, cost centre 332600 APD, Details
2. Asset 111000010979: Update Result, SIGHTED, WORKING, untick Correct Location?, New Asset Location APD / 819645, Level 2, Room No "QA mu", Submit
3. Switch to Logistics Officer 1, Asset > Assignment, open the new RELOCATE transaction (ASG00006385) and Approve
4. Switch back to VET IC, open the FAVE Details, tick 111000010979, Update Result, pick Sighted Result PENDING, Submit
5. Reload the FAVE and search the asset

## Expected
Either the result goes back to PENDING, or the dialog refuses with a message (as it does for Correct Location: "Can't set the location correctly because it has already been approved.").

## Actual
"The stocktake result is updated." is shown, but after a reload the row still shows SIGHTED / WORKING / No Further Action. Reproduced 3 times (with Correct Location ticked and unticked before picking PENDING).

## Evidence
- After the reset the FAVE row of 111000010979 still reads SIGHTED / WORKING / No Further Action / Working condition (reload, 3 tries)
- Covered by SPF-039 (the test avoids resetting after approval)

## Environment
- Base URL: https://mhauatweb.southeastasia.cloudapp.azure.com/Stocktake/Fave
- Env: staging

## History
- 2026-10-06: filed from manual check of the FAVE relocation flow (2026-10-06) in the Test Manager app.
