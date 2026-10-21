---
id: SPF-036
title: "VET IC imports a working result file and the assets become SIGHTED / WORKING"
feature: stocktake-fave
priority: P1
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-21
---

## Goal
Import Working Result batch-sights assets without RFID tags: every imported asset gets Sighted / Working.

## Preconditions
- Logged in as the test account (`SPF_USER` in .env) with Verification Team IC/2IC active
- A FAVE exists with a cost centre that is not APPROVED

## Data
- Cost centre `<cc>` and asset `<asset>`: the first non-approved cost centre of the current FAVE and its first asset (fixture faveTarget)
- File: .xlsx with A1 "LMSAssetID" and A2 `<asset>` (built by the test)

## Steps
1. Open the FAVE on `<cc>`, Details tab, search `<asset>` (if it has a result, set it back to PENDING with **Update Result**), then **Import Working Result**
2. Excel file: choose the file
3. Import
4. Search `<asset>` in the Details tab
5. Tick the asset and click **Update Result**

## Expected
- Step 1: `<asset>` shows PENDING before the import
- Step 2 lists row 1 with `<asset>`
- Step 3 shows "The import record(s) have been successful."
- Step 4: Result & Condition shows SIGHTED and WORKING (as for a result saved with Update Result), HTD Follow-up "No Further Action", FSSC Outcome "Working condition"
- Step 5: the dialog is pre-loaded with Sighted Result SIGHTED, Asset Condition WORKING and HTD Follow-up "No Further Action"

## Notes
Known bug BUG-007: the test is marked as expected to fail. Reported fixed on 2026-10-21, but the retest showed a partial fix: the import now fills the result, HTD Follow-up and FSSC Outcome, but saves "Sighted" instead of SIGHTED, so the row reads "Sighted WORKING" and Update Result opens with no Sighted Result (step 5). The asset starts PENDING so that an earlier result cannot make step 4 pass; cleanup sets it back to PENDING.

Automated in tests/e2e/stocktake-fave/fave-import.spec.ts.
