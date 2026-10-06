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
- A FAVE exists with a cost centre that is not APPROVED

## Data
- Cost centre `<cc>`: the first cost centre in the current FAVE's table that is not APPROVED (never one reserved for SPF-027), brought back to VET IC first; asset `<asset>`: its first asset in the Details tab. Found when the test runs (fixture faveTarget); the test skips when every cost centre is approved.
- Stocktakers: the first two names in the Assign dropdown (APD: Mohammad Shahrul Bin Ismail, Wong Pui Lai Annie)

## Steps
1. Open the first FAVE, pick cost centre `<cc>`, open **Assignment** and search `<asset>`
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
