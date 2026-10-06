---
id: SPF-040
title: "VET IC records a NOT SIGHTED result that stays open for investigation"
feature: stocktake-fave
priority: P1
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
A FAVE asset that is not found can be recorded as NOT SIGHTED; HTD Follow-up offers only the not-found outcomes, FSSC Outcome follows the choice and the FAVE Status stays OPEN (a follow-up item), and the result can be set back to PENDING.

## Preconditions
- Logged in as the test account (`SPF_USER` in .env) with Verification Team IC/2IC active
- A FAVE exists with a cost centre that is not APPROVED

## Data
- Cost centre `<cc>` and asset `<asset>`: as in SPF-020 (fixture faveTarget, found at runtime)
- Remarks `QA auto fave not sighted <unique>`

## Steps
1. Open the first FAVE, pick cost centre `<cc>`, open **Details**, search `<asset>`, tick it and click **Update Result**
2. Pick Sighted Result **NOT SIGHTED**
3. Pick HTD Follow-up **Asset Physically Disposed (To Dispose - D2)**, then **Cannot be found after investigation**
4. Type the Remarks and **Submit**
5. Reopen the FAVE and search the asset
6. Tick it, **Update Result**, pick **PENDING** and **Submit**

## Expected
- After step 2: HTD Follow-up "Not Found, for Investigation", FSSC Outcome "Under investigation", FAVE Status "OPEN", Correct Location disabled; HTD Follow-up offers exactly "Asset Physically Disposed (To Dispose - D2)", "Not Found, for Investigation", "Cannot be found after investigation"
- Step 3: FSSC Outcome becomes "Asset has been physically disposed", then "Cannot be found after investigation, FA record to be disposed"; FAVE Status stays "OPEN"
- Step 4 shows "The stocktake result is updated."
- Step 5: the row shows NOT SIGHTED, "Cannot be found after investigation" and its FSSC Outcome
- Step 6: the dialog is pre-loaded with NOT SIGHTED; after Submit the row shows PENDING

## Notes
Writes to the live FAVE on UAT; step 6 restores PENDING and cleanup resets it if the test stops halfway.

Automated in tests/e2e/stocktake-fave/fave-follow-up.spec.ts.
