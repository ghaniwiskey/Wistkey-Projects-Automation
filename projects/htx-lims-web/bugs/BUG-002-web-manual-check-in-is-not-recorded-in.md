---
id: BUG-002
title: "Web Manual Check-In is not recorded in the Audit Trail"
severity: major
status: open
env: staging
url: "https://htx.eastus.cloudapp.azure.com:5001/audittrail"
updated: 2026-11-18T08:10:39.241Z
found: 2026-11-18T03:56:54.190Z
foundBy: "explorations/2026-11-18-web-testing.md"
tests: [HLW-027]
frequency: always
---
## Summary
Check-ins done on the web Check In page do not appear in Report > Audit Trail, while check-outs, registrations, deletions and logins do.

## Steps to reproduce
1. Log in as ADMIN
2. Check In / Out > Check In > Check In an OUT item (e.g. 001000029)
3. Report > Audit Trail, read the newest entries

## Expected
An audit entry for the check-in with user, time and item (workflow: Audit Trail records who did what, web and handheld).

## Actual
No check-in entry: the 40 newest rows (11:30-11:48 on 18/11/2026) contain both loan check-outs (Check-out Item 23/24) but neither web check-in of 001000029 (~11:43) or 001000027 (~11:46).

## Evidence
- Audit actions seen: Login Handheld/Web, Logout Web, Login failed, Item registered, Item number assigned, Item register deleted, Check-out Item, Stock adjustment, Handheld stock take scan

## Environment
- Base URL: https://htx.eastus.cloudapp.azure.com:5001/audittrail
- Env: staging

## History
- 2026-11-18: filed from explorations/2026-11-18-web-testing.md in the Test Manager app.
- 2026-11-18: Web-only: handheld check-ins are audited ('Handheld check-in ... PUT /api/Raid/mobile/singlecheckin')..
