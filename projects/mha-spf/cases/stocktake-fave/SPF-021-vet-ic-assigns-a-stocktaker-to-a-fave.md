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
- Asset 111000010977
- Stocktakers of APD: Mohammad Shahrul Bin Ismail, Wong Pui Lai Annie

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
There is no unassign; the test always ends with the test account as stocktaker.

Automated in tests/e2e/stocktake-fave/fave.spec.ts.
