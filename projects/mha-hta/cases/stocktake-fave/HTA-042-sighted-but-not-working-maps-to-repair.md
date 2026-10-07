---
id: HTA-042
title: "SIGHTED but NOT WORKING maps to To Repair; NOT IN USE/OBSOLETE to To Dispose (FA5)"
feature: stocktake-fave
priority: P2
tags: [regression]
envs: [staging]
automated: true
created: 2026-10-07
updated: 2026-10-07
---

## Goal
The Update Result mapping for sighted assets that are not in working order follows the FSSC guideline.

## Preconditions
- Logged in as the test account (`HTA_USER` in .env) with Verification Team IC/2IC active
- A FAVE exists with a cost centre that is not APPROVED

## Data
- Cost centre `<cc>` and asset `<asset>`: as in HTA-020 (fixture faveTarget). Nothing is saved.

## Steps
1. Open the first FAVE, cost centre `<cc>`, Details, tick `<asset>`, **Update Result**
2. Pick Sighted Result **SIGHTED**, Asset Condition **NOT IN USE/OBSOLETE**
3. Change Asset Condition to **NOT WORKING**
4. Close the dialog with **Cancel**

## Expected
- Step 2: HTD Follow-up offers only "To Dispose (FA5)" and selects it; FSSC Outcome starts with "Asset is obsolete"; FAVE Status "CLOSED"
- Step 3: HTD Follow-up offers only "To Repair" and selects it; FSSC Outcome "Working condition" (intended; mha-spf BUG-010 closed as not a bug); FAVE Status "CLOSED"

## Notes
Automated in tests/e2e/stocktake-fave/fave-follow-up.spec.ts.
