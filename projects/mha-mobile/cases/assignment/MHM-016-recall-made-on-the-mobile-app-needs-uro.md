---
id: MHM-016
title: "Recall made on the mobile app needs URO approval and clears the FALO"
feature: assignment
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-16
updated: 2026-10-16
---

## Goal
A LOGS1 recalls an asset from its FALO on the phone (assign to Logistics Officer 1 = self); MHA web waits for the URO, and after approval the FALO is cleared.

## Preconditions
- The mobile account holds Logistics Officer 1 and is the LOGS1 of at least one asset
- The web account holds Logistics Officer 1 and Unit Resource Officer on the same cost centre

## Data
- Asset: the first result of the phone's Select Asset filtered by Assignee (LOGS1) = the mobile officer (not in an open transaction)
- FALO for the setup: the first FALO the Assign form offers that is not the mobile officer

## Steps
1. Mobile (Logistics Officer 1): if the asset has no FALO, Assign > ASSIGN to Fixed Asset Liaison Officer = the FALO, Complete (setup, auto-approved)
2. Mobile: Assign > Select Asset > the asset > ASSIGN, Role Logistics Officer 1, User = the mobile officer, Complete
3. MHA web: Asset > Assignment
4. MHA web as Unit Resource Officer: open the transaction, Approve > Yes
5. MHA web: the asset's Ownership tab

## Expected
- Step 3: the newest transaction is ASSIGN by the mobile officer, Approver Role Unit Resource Officer, Status SUBMITTED
- Step 4: "Assignment has been approved"
- Step 5: Current LOGS1 is the mobile officer and Current FALO is "-"

## Notes
Writes on UAT. Seen 2026-10-16: when the asset had no LOGS1 before, the same transaction sets the LOGS1 but keeps the FALO; a recall by the asset's own LOGS1 clears it (as on the web, SPF-018).
