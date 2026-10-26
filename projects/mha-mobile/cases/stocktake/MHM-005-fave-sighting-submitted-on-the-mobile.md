---
id: MHM-005
title: "FAVE sighting submitted on the mobile app shows in MHA web"
feature: stocktake
priority: P0
tags: [smoke, writes]
envs: [all]
automated: true
created: 2026-10-16
updated: 2026-10-26
---

## Goal
A stocktaker sights an asset of the current FAVE on the phone and submits it; MHA web holds the same result, condition, follow-up, remarks and statuses.

## Preconditions
- The web account (MHM_WEB_USER, default SPF_USER) holds VET IC for a cost centre of the current FAVE that is not APPROVED
- The mobile officer is offered as a stocktaker of that cost centre on MHA web

## Data
- Cost centre: first cost centre of the current FAVE (MHA web) that is not APPROVED and offers the mobile officer as stocktaker
- Asset: first PENDING asset there whose stocktaker is the mobile officer; else the first PENDING asset with no stocktaker, assigned in step 1
- Remarks: QA auto mobile <unique>

## Steps
1. MHA web as VET IC: open the current FAVE and the cost centre; when the asset has no stocktaker, assign the mobile officer (Assignment > Assign Stocktaker > Yes)
2. Mobile: log in, switch to Stocktaker and the cost centre, open Stocktake > the FAVE and answer CANCEL to "Will do stocktake by OFFLINE MODE?"
3. Search the asset ID, expand its location and open the asset
4. Turn on Sighted, keep Asset Condition WORKING, type the remarks, tap SAVE and CONFIRM
5. Open REVIEW and tap Submit
6. MHA web: open the FAVE, the cost centre and Details, search the asset; tick it and open Update Result
7. Cleanup: set Sighted Result PENDING and Submit

## Expected
- Step 1: "The stocktaker has been assigned." and the asset's Stocktaker is the mobile officer
- Step 2: the FAVE opens on tabs SELECT / VERIFY / REVIEW and the asset is in SELECT
- Step 3: StockTake Detail shows the asset's Asset No., Asset ID 2 and Serial Number as MHA web does
- Step 4: Sighted turns on Correct Location and sets WORKING; "Set this asset as sighted?" > CONFIRM moves the asset to REVIEW (REVIEW 1)
- Step 5: REVIEW goes back to 0
- Step 6: the Details row shows Result & Condition "SIGHTED WORKING", HTD Follow-up "No Further Action", FSSC Outcome "Working condition" and the mobile officer as Stocktaker
- Step 6: Update Result shows SIGHTED, WORKING, No Further Action, the typed remarks, FSSC Outcome "Working condition", FAVE Status CLOSED, Location Status CLOSED and Correct Location ticked
- Step 7: "The stocktake result is updated." and the asset is PENDING again (back in the phone's SELECT list next run)

## Notes
Automated in tests/e2e/stocktake/fave-sighting.spec.ts (screen objects tests/pages/mobile, web page objects tests/pages/web).
Writes on UAT: assigns a stocktaker once (no unassign; later runs reuse the asset) and records a result that the cleanup resets to PENDING. Approvals are never touched. BUG-001, closed as wont-fix on 2026-10-26: the mobile session lasts about 10 minutes and an in-flight sighting can be lost at expiry. This case works around that accepted behavior by logging in fresh before the phone part.
