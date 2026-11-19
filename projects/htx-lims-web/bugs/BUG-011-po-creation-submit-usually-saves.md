---
id: BUG-011
title: "PO Creation Submit usually saves nothing and gives no feedback"
severity: major
status: open
env: staging
url: "https://htx.eastus.cloudapp.azure.com:5001/casecreation"
updated: 2026-11-19T06:26:05.468Z
found: 2026-11-19T06:26:05.468Z
foundBy: "explorations/2026-11-19-coverage-review.md"
tests: [HLW-007, HLW-052]
frequency: intermittent
---
## Summary
After the 19/11 deploy, Submit on PO Creation with all required fields filled saved a PO in 1 of 6 attempts (Admin 4, USER1 2). There is no success or error message either way, and the one PO that was saved (QAPODEL812171) only showed in PO Management after logging in again. HLW-007 passed on 18/11.

## Steps to reproduce
1. Log in as ADMIN or USER1
2. Purchase Order > PO Creation: PO Number and PO Name QAPO<6 digits>, Supplier, PO Location 00003 Lab Room, Item Type Consumables, PO Date today
3. Click Submit
4. Open PO Management and search the PO Number (also after logging in again)

## Expected
A success message, and PO Management lists the new PO.

## Actual
No message; the form keeps its values; the PO is not listed (QAPODEL812171B, QAPODEL812171U, QAPO108825, QAPO227262, QAPO284689 were never saved). The Audit Trail has no PO entry.

## Evidence
- projects/htx-lims-web/runs/<run>/screenshots (HLW-007)

## Environment
- Base URL: https://htx.eastus.cloudapp.azure.com:5001/casecreation
- Env: staging

## History
- 2026-11-19: filed from explorations/2026-11-19-coverage-review.md in the Test Manager app.
