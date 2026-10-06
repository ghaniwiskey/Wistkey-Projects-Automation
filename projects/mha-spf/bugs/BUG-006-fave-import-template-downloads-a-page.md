---
id: BUG-006
title: "FAVE: Import Template downloads a \"Page Not Found\" page instead of the template"
severity: minor
status: open
env: staging
url: https://mhauatweb.southeastasia.cloudapp.azure.com/Stocktake/FaveForm?stktakeFAVEId=<id>
found: 2026-10-06
foundBy: "explorations/2026-10-06-uncovered-flows.md"
tests: [SPF-037]
frequency: always
---
## Summary
In the FAVE Details tab, Import Working Result > Import Template fetches /Templates/StocktakeFAVEWorkTemplate.zip. The server answers 200 with the HTML "Page Not Found" page, which the button saves as the template file, so users get a broken file instead of the LMSAssetID template.

## Steps to reproduce
1. Log in as SPF-A2216GA, switch the role to Verification Team IC/2IC
2. Stocktake > FAVE, open FAVE FY26-2007, pick a cost centre that is not approved (332300 CID)
3. Details > Import Working Result > Import Template

## Expected
A template file with header A1 "LMSAssetID" is downloaded (manual, Figure 114).

## Actual
GET /Templates/StocktakeFAVEWorkTemplate.zip returns 200 text/html "Page Not Found" ("Please click HERE for return to Home."); that page is what gets saved.

## Evidence
- GET /Templates/StocktakeFAVEWorkTemplate.zip -> 200 text/html, 648 bytes, <h2>Page Not Found</h2>

## Environment
- Base URL: https://mhauatweb.southeastasia.cloudapp.azure.com/Stocktake/FaveForm?stktakeFAVEId=<id>
- Env: staging

## History
- 2026-10-06: filed from explorations/2026-10-06-uncovered-flows.md in the Test Manager app.
