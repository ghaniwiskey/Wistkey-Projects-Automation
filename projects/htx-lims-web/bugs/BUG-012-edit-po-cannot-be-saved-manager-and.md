---
id: BUG-012
title: "Edit PO cannot be saved: Manager and Officer are required but their lists are empty"
severity: major
status: open
env: staging
url: "https://htx.eastus.cloudapp.azure.com:5001/casemanagement"
updated: 2026-11-19T06:26:05.610Z
found: 2026-11-19T06:26:05.610Z
foundBy: "explorations/2026-11-19-coverage-review.md"
tests: [HLW-051]
frequency: always
---
## Summary
Edit PO marks Manager and Officer as required, but both dropdowns show "No Result", and existing POs (made in PO Creation, which has no such fields) have them empty. Submit does nothing and shows no message (only a hidden tooltip "SelectedItemManager is required.").

## Steps to reproduce
1. Log in as ADMIN
2. PO Management > Edit on QAPO521908 (or PO001)
3. Change PO Name, click Submit
4. Open the Manager and Officer lists

## Expected
The PO is saved, or the form says which fields are missing and offers values for them.

## Actual
Nothing saved, no visible message; Manager and Officer lists are empty, so no PO can be edited.

## Evidence
- HLW-051 screenshots

## Environment
- Base URL: https://htx.eastus.cloudapp.azure.com:5001/casemanagement
- Env: staging

## History
- 2026-11-19: filed from explorations/2026-11-19-coverage-review.md in the Test Manager app.
