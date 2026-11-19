---
id: BUG-016
title: "Stock adjustment OUT -> IN leaves a loaned item on the gantry whitelist"
severity: critical
status: open
env: staging
url: "https://htx.eastus.cloudapp.azure.com:5001/stocktakedetail/ST00000015"
updated: 2026-11-19T06:26:06.161Z
found: 2026-11-19T06:26:06.161Z
foundBy: "explorations/2026-11-19-coverage-review.md"
tests: [HLW-066, HLW-055]
frequency: always
---
## Summary
After a stock-take adjustment sets a loaned item back to IN, the item stays on the gantry whitelist with purpose LOAN, so it can leave through an exit gantry without an alert. Same gap as BUG-001 (web Check In).

## Steps to reproduce
1. Completed stock take ST00000015 lists 002000017 as Located, recorded OUT (Loan)
2. Adjust it to IN with a reason
3. POST /api/GantryWhitelist/status with its chip code; Item/{id}

## Expected
The item leaves the whitelist and its loan is closed.

## Actual
Status IN, exhibitStatus LOAN, whitelist status true; Loan Out Report shows Returned with no Returned On.

## Evidence
- HLW-055 screenshots

## Environment
- Base URL: https://htx.eastus.cloudapp.azure.com:5001/stocktakedetail/ST00000015
- Env: staging

## History
- 2026-11-19: filed from explorations/2026-11-19-coverage-review.md in the Test Manager app.
