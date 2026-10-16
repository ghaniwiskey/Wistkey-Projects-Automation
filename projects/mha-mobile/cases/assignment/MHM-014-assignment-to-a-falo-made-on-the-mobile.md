---
id: MHM-014
title: "Assignment to a FALO made on the mobile app is auto-approved on MHA web"
feature: assignment
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-16
updated: 2026-10-16
---

## Goal
A LOGS1 assigns an asset to a FALO from the phone; the transaction is approved at once and MHA web shows the FALO as the asset's current FALO.

## Preconditions
- The mobile account holds Logistics Officer 1 and is the LOGS1 of at least one asset
- The web account holds Logistics Officer 1 on the same cost centre

## Data
- Asset: the first result of the phone's Select Asset filtered by Assignee (LOGS1) = the mobile officer (not in an open transaction)
- FALO: the first officer the Assign form offers for Fixed Asset Liaison Officer who is not the asset's current FALO

## Steps
1. Mobile: log in, switch to Logistics Officer 1 and the cost centre, tap Assign
2. Select Asset > Assignee (LOGS1) = the officer > Search > + on the first asset > close; Asset Selected shows 1
3. MHA web: read the asset's Ownership (Current LOGS1, Current FALO)
4. Mobile: transaction type ASSIGN, Role Fixed Asset Liaison Officer, User = the FALO, Complete
5. MHA web: Asset > Assignment, then the asset's Ownership tab

## Expected
- Step 4: the form resets (Asset Selected 0)
- Step 5: the newest transaction is ASSIGN, the asset's cost centre, created by the mobile officer, Approver Role "-", Status APPROVED
- Step 5: Current FALO is the chosen FALO; Current LOGS1 is unchanged (the mobile officer)

## Notes
Writes on UAT: one auto-approved ASSIGN per run; the asset keeps the new FALO (MHM-016 recalls it). Approval rule: LOGS1 > FALO is auto-approved (mha-spf SPF-009).
