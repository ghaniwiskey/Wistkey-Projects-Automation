---
id: BUG-020
title: "Check In Out Report shows the later check-out purpose on the check-in row"
severity: minor
status: open
env: staging
url: "https://htx.eastus.cloudapp.azure.com:5001/checkinoutreport"
updated: 2026-11-19T06:26:06.708Z
found: 2026-11-19T06:26:06.708Z
foundBy: "explorations/2026-11-19-coverage-review.md"
tests: [HLW-062, HLW-016]
frequency: always
---
## Summary
The check-in row of 002000026 (handheld check-in 14:13) shows Exhibit Status NO RETURN, the purpose of the check-out made at 14:17.

## Steps to reproduce
1. Check 002000026 in on the handheld, then check it out No Return
2. Report > Check In Out Report, search 002000026

## Expected
The check-in row shows no purpose (or the purpose at that time).

## Actual
Both rows show NO RETURN.

## Evidence
- HLW-062 screenshot

## Environment
- Base URL: https://htx.eastus.cloudapp.azure.com:5001/checkinoutreport
- Env: staging

## History
- 2026-11-19: filed from explorations/2026-11-19-coverage-review.md in the Test Manager app.
