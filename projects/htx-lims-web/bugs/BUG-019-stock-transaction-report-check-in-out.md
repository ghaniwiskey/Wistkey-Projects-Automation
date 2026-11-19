---
id: BUG-019
title: "Stock Transaction Report: check-in/out rows have no location and pre check-in is labelled \"Registered to PO\""
severity: minor
status: open
env: staging
url: "https://htx.eastus.cloudapp.azure.com:5001/stockreport/transactions"
updated: 2026-11-19T06:26:06.574Z
found: 2026-11-19T06:26:06.574Z
foundBy: "explorations/2026-11-19-coverage-review.md"
tests: [HLW-060]
frequency: always
---
## Summary
Check-out and check-in rows have an empty Location (the check-in of 002000025 was at Airlock 1), and every handheld pre check-in is shown as "Registered to PO" although no PO is linked (Q-010).

## Steps to reproduce
1. Report > Stock Transaction Report
2. Item description: QA print asset 42609 > Search

## Expected
Location of the check-in/out, and a "Pre check-in" event name.

## Actual
Location empty except for gantry events; event "Registered to PO".

## Evidence
- HLW-060 screenshot

## Environment
- Base URL: https://htx.eastus.cloudapp.azure.com:5001/stockreport/transactions
- Env: staging

## History
- 2026-11-19: filed from explorations/2026-11-19-coverage-review.md in the Test Manager app.
