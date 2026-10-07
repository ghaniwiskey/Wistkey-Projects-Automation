---
id: HTA-039
title: "FAVE incorrect location raises a relocation that LOGS1 approves and the asset location changes"
feature: stocktake-fave
priority: P1
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-07
updated: 2026-10-07
---

## Goal
When VET IC records a FAVE asset as SIGHTED at an incorrect location with a new location, a RELOCATE assignment transaction is raised for the asset's LOGS1; approving it moves the asset to the new location.

## Preconditions
- Logged in as the test account (`HTA_USER` in .env), which holds Verification Team IC/2IC and Logistics Officer 1
- A FAVE exists with a cost centre that is not APPROVED

## Data
- Cost centre `<cc>` and asset `<asset>`: the first cost centre of the current FAVE that is not APPROVED and has a PENDING asset whose Assignee (LOGS1) is the test account (Details filters Assignee (LOGS1) + Result PENDING); the FAVE is brought back to VET IC first. Found when the test runs; skipped when none is left.
- Asset `<asset>` has no SUBMITTED assignment transaction (cancelled before the test)
- New location: Group = first option offered, Postal Code = the asset's current postal code (first address found), Block `<unique, max 10>`, Level `<random, max 3>`, Room No `<unique, max 5>`, New Location Remarks `QA auto fave relocate <unique>`

## Steps
1. As LOGS1 open asset `<asset>` (Asset > Listing) > **Location** tab and note the current location
2. Switch to VET IC, open the first FAVE, pick cost centre `<cc>`, open **Details**, search `<asset>`, tick it and click **Update Result**
3. Pick Sighted Result **SIGHTED**, Asset Condition **WORKING** and untick **Correct Location?**
4. Click **Submit** with the New Asset Location empty
5. Pick the Group, click **Submit**; then pick the Postal Code, click **Submit**
6. Fill Block, Level, Room No and New Location Remarks and click **Submit**
7. Switch to LOGS1, open **Asset > Assignment**, filter Status SUBMITTED and search `<asset>`
8. Open the transaction (pencil)
9. Click **Approve** and confirm with **Yes**
10. Open asset `<asset>` > **Location** tab

## Expected
- After step 3: HTD Follow-up "No Further Action", FAVE Status "CLOSED", Location Status "OPEN" and a "New Asset Location" section (Group / NPC / Base, Postal Code, Building, Address, Block, Level, Room No, New Location Remarks) is shown
- Step 4 shows "Group / NPC / Base selection cannot be empty."; step 5 shows "Asset location cannot be empty." and then "You must enter at least one field of Block / Level / Room No / Location Remarks."; the dialog stays open
- Step 6 shows "The stocktake result is updated." and the row shows SIGHTED / WORKING
- Step 7 lists exactly one SUBMITTED transaction for the asset: type RELOCATE, Created By the test officer, Approver Role "Logistics Officer 1"
- Step 8: Transaction Type RELOCATE, status SUBMITTED, the asset `<asset>` is listed and Asset Location shows the postal code, Block, Level, Room No and Remarks typed in step 6; Approve is offered
- Step 9 shows "Are you sure to approve?" then "Assignment has been approved"; the transaction is APPROVED
- Step 10: the asset Location tab shows the new Block, Level, Room No and Remarks (different from step 1) and the postal code from step 6

## Notes
Writes on UAT and cannot be undone: after the relocation is approved the FAVE result is locked (Correct Location gives "Can't set the location correctly because it has already been approved."; a reset to PENDING shows success but changes nothing; accepted: BUG-015 / mha-spf BUG-009, closed as wont-fix), so each run uses up one PENDING asset owned by the test account; the test skips when none is left. The asset keeps the new location (like HTA-008). Cleanup: cancel any SUBMITTED transaction on the asset; if the test stops before approval, reset the FAVE result to PENDING.

Open question: after approval the FAVE Details row still shows the old location (e.g. "Level 1 Room NA") and the result keeps Location Status OPEN. Not asserted; confirm with the product team whether the FAVE row should follow the asset.

Field limits in the New Asset Location section: Block 10, Level 3, Room No 5, New Location Remarks 200 characters (longer input is cut by the field).

Automated in tests/e2e/stocktake-fave/fave-relocate.spec.ts (fixture faveRelocateTarget in tests/fixtures/pages.fixture.ts; afterEach cancels a SUBMITTED relocation and, before approval, resets the result to PENDING).
