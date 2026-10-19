---
id: BUG-005
title: "Switch Role lists the cost centres of the previous role, so a role can be confirmed on a unit it does not hold"
severity: major
status: open
env: staging
url: "Mobile app home > Switch (Switch Role panel: Select Role, Select Cost Center)"
found: 2026-10-19
foundBy: "MHM-013 triage 2026-10-19"
tests: [MHM-024]
frequency: always
---
## Summary
The Switch Role panel's Select Cost Center does not follow the role picked in Select Role. It lists the cost centres of the role that was active when the home screen was shown, and keeps that list even after another role is confirmed, until the user leaves home (opens a tile) and comes back. After a login (the app starts as Agency Admin) it lists every agency cost centre, so the user can confirm e.g. Logistics Officer 1 on a unit where they are not LOGS1. The app accepts it and shows that role's tiles with empty lists.

## Steps to reproduce
1. Log in on the mobile app (the account of MHM_USER: roles Agency Admin, UAO, URO, LOGS1, FALO, VET IC, Stocktaker). Home shows "Agency Admin | 332100"
2. Tap Switch > Select Role > Logistics Officer 1 > open Select Cost Center
3. Pick 332110 > Confirm
4. Open Asset Registration, then Assign > Select Asset > Search; go back home
5. Tap Switch > open Select Cost Center

## Expected
Step 2: Select Cost Center lists only the units where the officer is Logistics Officer 1 (332100, 332140, 332200, 332600 on UAT, as the panel shows for that role once home is shown again), so 332110 cannot be picked.

## Actual
Step 2: Select Cost Center lists all agency cost centres (332100, 332110, 332123, 332130, 332140, ...), the Agency Admin list. Step 3: accepted; the bottom bar reads "Logistics Officer 1 | 332110" and home shows the LOGS1 tiles. Step 4: Register Asset (0), Select Asset "Nothing to show yet" (no other unit's data seen). Step 5: now the list is the LOGS1 one (332100, 332140, 332200, 332600), which does not even hold the active 332110.
The reverse also happens: confirming Agency Admin while LOGS1 was active keeps the 4-unit LOGS1 list in the panel until the app is restarted.

## Evidence
- Emulator, UAT, 2026-10-19 ~10:30 WIB, read with uiautomator dumps of the panel and dropdown
- Made MHM-013 and MHM-023 fail on 2026-10-19 (run 2026-10-19_1009 and _1018): the test read 332110 from the panel for LOGS1, then the panel no longer offered it

## Environment
- Base URL: Mobile app Switch Role panel (UAT backend)
- Env: staging

## History
- 2026-10-19: filed from MHM-013 triage (the "Select Cost Center does not reliably follow the role" open lead in context.md, now reproduced every time).
- 2026-10-19: linked to MHM-024 (automated, expected to fail while open).
