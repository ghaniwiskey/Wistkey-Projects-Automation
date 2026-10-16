---
id: MHM-015
title: "FALO return made on the mobile app is approved by LOGS1 on MHA web"
feature: assignment
priority: P1
tags: [regression, writes]
envs: [all]
automated: true
created: 2026-10-16
updated: 2026-10-16
---

## Goal
A FALO returns an asset to its LOGS1 from the phone; MHA web holds it for LOGS1 approval, and after approval the asset has no FALO.

## Preconditions
- The mobile account holds Logistics Officer 1 and Fixed Asset Liaison Officer on the cost centre
- The web account holds Logistics Officer 1 on the same cost centre

## Data
- Asset: the first result of the phone's Select Asset filtered by Assignee (LOGS1) = the mobile officer (not in an open transaction)

## Steps
1. Mobile (Logistics Officer 1): Assign > the asset > ASSIGN to Fixed Asset Liaison Officer = the mobile officer, Complete (setup, auto-approved)
2. Mobile: switch to Fixed Asset Liaison Officer and the cost centre, Assign > Select Asset > the asset
3. ASSIGN, Role Logistics Officer 1, User = the mobile officer (the asset's LOGS1), Complete
4. MHA web (LOGS1): Asset > Assignment, open the newest transaction, Approve > Yes
5. MHA web: the asset's Ownership tab

## Expected
- Step 3: the form resets (Asset Selected 0)
- Step 4: the newest transaction is ASSIGN by the mobile officer, Approver Role Logistics Officer 1, Status SUBMITTED; Approve gives "Assignment has been approved"
- Step 5: Current LOGS1 is the mobile officer and Current FALO is "-"

## Notes
Writes on UAT: one auto-approved ASSIGN and one approved return per run; the asset ends as it started (no FALO). The phone offers FALO > Logistics Officer 1 (the web Assign as FALO offers FALO and End User only).
Automated in tests/e2e/assignment/assign.spec.ts.
