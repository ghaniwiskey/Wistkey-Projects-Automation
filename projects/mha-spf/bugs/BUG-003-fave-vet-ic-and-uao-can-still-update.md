---
id: BUG-003
title: "FAVE: VET IC (and UAO) can still update stocktake results after VET IC has submitted the FAVE"
severity: major
status: open
env: staging
url: https://mhauatweb.southeastasia.cloudapp.azure.com/Stocktake/FaveForm?stktakeFAVEId=<id>
found: 2026-10-06
foundBy: "exploratory session 2026-10-06 (Aside)"
tests: [SPF-025]
frequency: always
---
## Summary
After VET IC submits a unit's FAVE to the URO, the Details tab still shows Update Result to VET IC and saving works ("The stocktake result is updated."). Only Import Working Result is hidden. The UAO also sees Update Result. The user manual says that once VET IC submits, the URO unlocks the update feature, and that UAO only monitors. Please confirm the intended rule.

## Steps to reproduce
1. Log in as SPF-A2216GA, switch the role to Verification Team IC/2IC.
2. Stocktake > FAVE, open FAVE FY26-2007, pick cost centre 332600 APD, Summary > Submit > Yes ("Stocktake FAVE has been submitted.").
3. Details tab: search 111000010977, tick it, Update Result, pick SIGHTED and WORKING, Submit.

## Expected
After the submission VET IC can no longer change results (Update Result hidden or refused) until the FAVE is rejected back to VET IC (manual: "[FAVE] How to update Stocktake details in FAVE? (VET IC and URO only)").

## Actual
Update Result is shown and the change is saved: "The stocktake result is updated.". Import Working Result is hidden, so the lock is only partly applied. As Unit Approving Officer the Details tab also shows Update Result.

## Evidence
- 2026-10-06 12:47: VET IC set 111000010977 to SIGHTED/WORKING after submitting; set back to PENDING afterwards.

## Environment
- Base URL: https://mhauatweb.southeastasia.cloudapp.azure.com/Stocktake/FaveForm?stktakeFAVEId=<id>
- Env: staging

## History
- 2026-10-06: filed from exploratory session 2026-10-06 (Aside) in the Test Manager app.
