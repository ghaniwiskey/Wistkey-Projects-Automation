---
id: BUG-014
title: "Settings > Group: Description is cut to 200 characters without a limit on the field or a message"
severity: trivial
status: open
env: staging
url: https://mhauatwebhta.southeastasia.cloudapp.azure.com/Setting/LocationForm
found: 2026-10-07
foundBy: "SPF-vs-HTA recheck (Aside)"
tests: []
frequency: always
---
## Summary
The Group form limits Name (Short) to 25 and Name (Long) to 100 characters in the field, but Description has no maxlength. A 250-character description is accepted with "Group has been successfully created." and silently saved as its first 200 characters. Same defect as mha-spf BUG-008.

## Steps to reproduce
1. Log in as the HTA test account, role Logistics Officer 1
2. Settings > Group > Create: first cost centre, Name (Short) and Name (Long) "QA auto <unique>", Description 250 characters
3. Update ("Group has been successfully created."), search the group and open it

## Expected
The Description field stops at 200 characters (manual field limit) or the form says it is too long.

## Actual
The field takes 250 characters, the save succeeds, and the saved Description has 200 characters (reproduced on HTA 2026-10-07). The QA group was deleted afterwards.

## Evidence
- Verified by hand on HTA 2026-10-07 (250 typed, 200 stored)

## Environment
- Base URL: https://mhauatwebhta.southeastasia.cloudapp.azure.com/Setting/LocationForm
- Env: staging

## History
- 2026-10-07: filed from the SPF-vs-HTA recheck; same as mha-spf BUG-008.
