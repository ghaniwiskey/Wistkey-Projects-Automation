---
id: BUG-008
title: "Settings > Group: Description is cut to 200 characters without a limit on the field or a message"
severity: trivial
status: open
env: staging
url: https://mhauatweb.southeastasia.cloudapp.azure.com/Setting/LocationForm
found: 2026-10-06
foundBy: "explorations/2026-10-06-uncovered-flows.md"
tests: []
frequency: always
---
## Summary
The Group form limits Name (Short) to 25 and Name (Long) to 100 characters in the field, but Description has no maxlength. A 250-character description is accepted with "Group has been successfully created." and silently saved as its first 200 characters.

## Steps to reproduce
1. Log in as SPF-A2216GA, switch the role to Logistics Officer 1
2. Settings > Group > Create: Cost Centre 332600 - APD, Name (Short) and Name (Long) "QA auto <unique>", Description 250 characters
3. Update ("Group has been successfully created."), search the group and open it

## Expected
The Description field stops at 200 characters (manual field limit) or the form says it is too long.

## Actual
The field takes 250 characters, the save succeeds, and the saved Description has 200 characters. The test group was deleted afterwards.

## Evidence
- 

## Environment
- Base URL: https://mhauatweb.southeastasia.cloudapp.azure.com/Setting/LocationForm
- Env: staging

## History
- 2026-10-06: filed from explorations/2026-10-06-uncovered-flows.md in the Test Manager app.
