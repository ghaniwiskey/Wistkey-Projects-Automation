---
id: SPF-021
title: "VET IC assigns a stocktaker to a FAVE asset"
feature: stocktake-fave
priority: P1
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
VET IC can assign (and reassign) the stocktaker who sights a FAVE asset in the mobile app; the stocktaker is mandatory.

## Preconditions
- Logged in as SPF-A2216GA with Verification Team IC/2IC active
- Asset 111000010977 is in the current FAVE for 332600 APD

## Data
- The test works on the first cost centre of FAVE.costCentres (332600 APD, then 332300 CID) that is not APPROVED in the current FAVE, brought back to VET IC first, and on its first asset (APD: 111000010977); it skips when all are approved (fixture faveTarget).
- Asset 111000010977
- Stocktakers: the first two names in the Assign dropdown (APD: Mohammad Shahrul Bin Ismail, Wong Pui Lai Annie)

## Steps
1. Open the first FAVE, pick cost centre **332600 APD**, open **Assignment** and search **111000010977**
2. Tick the asset, click **Assign Stocktaker** and **Submit** without a stocktaker
3. Pick **Mohammad Shahrul Bin Ismail**, **Submit**, answer **Yes**
4. Tick the asset again and assign **Wong Pui Lai Annie** the same way

## Expected
- Step 2 shows "User is required" and the dialog stays open
- Step 3 asks "Please confirm if you would like to proceed with assigning a stocktaker to this FAVE." and then shows "The stocktaker has been assigned."; the Stocktaker column shows Mohammad Shahrul Bin Ismail
- After step 4 the Stocktaker column shows Wong Pui Lai Annie (reassigning replaces the stocktaker)

## Notes
There is no unassign. The reassign step runs only when the cost centre has two or more stocktakers.

Automated in tests/e2e/stocktake-fave/fave.spec.ts.
