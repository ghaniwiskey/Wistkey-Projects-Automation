---
id: BUG-009
title: "Audit Trail counts the item description as a tag in handheld entries"
severity: trivial
status: open
env: staging
url: "https://htx.eastus.cloudapp.azure.com:5001/audittrail"
updated: 2026-11-18T08:35:48.149Z
found: 2026-11-18T08:35:48.149Z
foundBy: "explorations/2026-11-18-web-testing.md"
tests: [HLW-027]
frequency: always
---
## Summary
Handheld register / count / check-in audit entries for one tag say '2 tag(s): <chip code>, <description>'.

## Steps to reproduce
1. Pre check-in or check in one item on the handheld
2. Report > Audit Trail

## Expected
'1 tag(s): <chip code>' (description shown separately).

## Actual
e.g. 'Handheld check-in ... PUT /api/Raid/mobile/singlecheckin 2 tag(s): 010030000000000001000031, QA print asset 42609; Location: 00001; OK'. Check-out and stock take entries count correctly ('1 tag(s)').

## Evidence
- 

## Environment
- Base URL: https://htx.eastus.cloudapp.azure.com:5001/audittrail
- Env: staging

## History
- 2026-11-18: filed from explorations/2026-11-18-web-testing.md in the Test Manager app.
