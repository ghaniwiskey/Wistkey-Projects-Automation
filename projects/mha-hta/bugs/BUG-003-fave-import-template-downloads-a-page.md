---
id: BUG-003
title: "FAVE: Import Template downloads a page instead of the template file"
severity: minor
status: open
env: staging
url: https://mhauatwebhta.southeastasia.cloudapp.azure.com/Stocktake/FaveForm?stktakeFAVEId=<id>
found: 2026-10-07
foundBy: "first HTA run of HTA-037 (Aside)"
tests: [HTA-037]
frequency: always
---
## Summary
FAVE Details > Import Working Result > Import Template saves a file that is not the zip template (it does not start with "PK"; it is an HTML page). Same defect as mha-spf BUG-006 ("Page Not Found" page).

## Steps to reproduce
1. Log in as the HTA test account, role Verification Team IC/2IC
2. Stocktake > FAVE, open FAVE FY26-9001, pick a cost centre that is not approved
3. Details > Import Working Result > Import Template

## Expected
A template file with header A1 "LMSAssetID" (manual, Figure 114).

## Actual
The downloaded file is text/HTML, not a zip archive.

## Evidence
- HTA-037 step 2: the first bytes of the download are not "PK"

## Environment
- Base URL: https://mhauatwebhta.southeastasia.cloudapp.azure.com/Stocktake/FaveForm?stktakeFAVEId=<id>
- Env: staging

## History
- 2026-10-07: filed from the first HTA run (HTA-037 failed at step 2); same as mha-spf BUG-006.