---
id: MHM-022
title: "Assign and relocate made on the mobile app is auto-approved on MHA web"
feature: assignment
priority: P1
tags: [regression, writes]
envs: [all]
automated: true
created: 2026-10-16
updated: 2026-10-16
---

## Goal
A LOGS1 assigns an asset to a FALO and moves it in one ASSIGN & RELOCATE transaction from the phone; MHA web approves it at once and shows the new FALO and location.

## Preconditions
- The mobile account holds Logistics Officer 1 and is the LOGS1 of at least one asset
- The web account holds Logistics Officer 1 on the same cost centre

## Data
- Asset: the first result of the phone's Select Asset filtered by Assignee (LOGS1) = the mobile officer
- FALO: the first one offered who is not the current FALO
- New Room No: Q<unique>; location remarks retyped as they are (BUG-002)

## Steps
1. Mobile: Logistics Officer 1 | cost centre > Assign > Select Asset (Assignee (LOGS1) = the officer) > first asset
2. MHA web: read the asset's location and ownership
3. Mobile: ASSIGN & RELOCATE, Role Fixed Asset Liaison Officer, User = the FALO; the location pre-fills; set Room, retype the remarks, Complete
4. MHA web: Asset > Assignment, the asset's Ownership and Location
5. Cleanup: relocate it back to the original Room from the phone

## Expected
- Step 3: the location pre-fills the asset's postal code (Remarks shows "No Remarks", BUG-002); after Complete the form resets
- Step 4: the newest transaction of the asset is ASSIGN & RELOCATE by the mobile officer, Approver Role "-", APPROVED
- Step 4: Current FALO is the chosen FALO; Room No is the new value; postal code, block, level and remarks unchanged
- Step 5: Room No is back to the original value

## Notes
Writes on UAT: two auto-approved transactions per run; the asset keeps the new FALO (MHM-016 recalls it). Explored 2026-10-16: ASG00006422 on 111000010977.
Automated in tests/e2e/assignment/assign.spec.ts.
