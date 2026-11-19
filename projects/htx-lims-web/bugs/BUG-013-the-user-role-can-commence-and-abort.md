---
id: BUG-013
title: "The User role can commence and abort stock takes from /stocktakedetail by address"
severity: major
status: open
env: staging
url: "https://htx.eastus.cloudapp.azure.com:5001/stocktakedetail/ST00000018"
updated: 2026-11-19T06:26:05.740Z
found: 2026-11-19T06:26:05.740Z
foundBy: "explorations/2026-11-19-coverage-review.md"
tests: [HLW-065, HLW-061]
frequency: always
---
## Summary
Stock Take List is blocked for the User role, but /stocktakedetail/<no> opens for a User and Commence and Abort are enabled. USER1 (no extra permissions) aborted ST00000018.

## Steps to reproduce
1. As ADMIN create a QA stock take (Draft)
2. Log in as USER1
3. Open /stocktakedetail/ST00000018
4. Click Abort and confirm

## Expected
"You're Not Authorized!" (like /stocktakelist) or no state buttons.

## Actual
The page opens with Commence and Abort enabled; Abort set the stock take to Aborted.

## Evidence
- HLW-061 screenshots

## Environment
- Base URL: https://htx.eastus.cloudapp.azure.com:5001/stocktakedetail/ST00000018
- Env: staging

## History
- 2026-11-19: filed from explorations/2026-11-19-coverage-review.md in the Test Manager app.
