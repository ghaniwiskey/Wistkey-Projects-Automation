---
id: BUG-015
title: "Administrator changes are not recorded in the Audit Trail"
severity: major
status: open
env: staging
url: "https://htx.eastus.cloudapp.azure.com:5001/audittrail"
updated: 2026-11-19T06:26:06.021Z
found: 2026-11-19T06:26:06.021Z
foundBy: "explorations/2026-11-19-coverage-review.md"
tests: [HLW-052, HLW-053, HLW-054, HLW-027]
frequency: always
---
## Summary
Creating and deleting purchase orders, adding users, changing a user's role or extra permissions and deleting users leave no Audit Trail entry. Item, tag, check-in/out and stock adjustment actions are recorded.

## Steps to reproduce
1. As ADMIN on 19/11 14:00-14:25: delete PO QAPODEL812171, change QAUSER107393 role to Administrator and back, grant Stock adjustment, add QADEL539047, delete QADEL539047
2. Open Report > Audit Trail

## Expected
One entry per change with user, time and target.

## Actual
Only logins, logouts and item / handheld actions are listed.

## Evidence
- Audit Trail 19/11/2026 13:46-14:25

## Environment
- Base URL: https://htx.eastus.cloudapp.azure.com:5001/audittrail
- Env: staging

## History
- 2026-11-19: filed from explorations/2026-11-19-coverage-review.md in the Test Manager app.
