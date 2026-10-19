---
id: MHM-024
title: "Switch Role offers only the cost centres of the role picked in the panel"
feature: role
priority: P1
tags: [regression]
envs: [all]
automated: true
created: 2026-10-19
updated: 2026-10-19
---

## Goal
Select Cost Center in the Switch Role panel follows the role picked in Select Role, so a role cannot be confirmed on a unit where the officer does not hold it.

## Preconditions
- The mobile account holds Logistics Officer 1 and starts as another role after login (Agency Admin on UAT)

## Data
- None fixed: the units the officer holds as Logistics Officer 1 are read from the app (step 2)

## Steps
1. Log in on the app; tap Switch, pick Select Role "Logistics Officer 1" (no Confirm) and note every cost centre Select Cost Center offers; close the panel
2. Switch to Logistics Officer 1 with the first cost centre offered, Confirm; open Settings and go back; tap Switch and note every cost centre Select Cost Center offers

## Expected
- Step 1 offers the same cost centres as step 2 (the units the officer holds as Logistics Officer 1)

## Notes
Automated in tests/e2e/role/switch-role-cost-centres.spec.ts; expected to fail while BUG-005 is open: step 1 lists the previous role's cost centres (after login all agency cost centres, e.g. 332110), and the list changes only once home is shown again. UAT 2026-10-19: LOGS1 holds 332100, 332140, 332200, 332600.
