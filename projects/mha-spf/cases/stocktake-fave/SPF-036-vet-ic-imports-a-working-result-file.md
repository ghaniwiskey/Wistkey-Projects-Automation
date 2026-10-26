---
id: SPF-036
title: "VET IC imports a working result file and the assets become SIGHTED / WORKING"
feature: stocktake-fave
priority: P1
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-23
---

## Goal
Import Working Result batch-sights assets without RFID tags: every imported asset gets Sighted / Working.

## Preconditions
- Logged in as the test account (`SPF_USER` in .env) with Verification Team IC/2IC active
- A FAVE exists with a cost centre that is not APPROVED

## Data
- Cost centre `<cc>`: normally the first non-approved cost centre of the current FAVE (fixture faveTarget). `SPF_FAVE_COST_CENTRE` may select a specific unapproved cost centre.
- Import size: `SPF_FAVE_IMPORT_COUNT` defaults to 1. For a larger batch, the test obtains distinct IDs at runtime from the FAVE export and only proceeds when the cost centre has at least that many assets and all are PENDING. It bulk-resets the cost centre to PENDING afterward, which is safe under that precondition.
- File: .xlsx with A1 "LMSAssetID" and one asset ID per row (built by the test)

## Steps
1. Open the FAVE on `<cc>`, Details tab, search `<asset>` (if it has a result, set it back to PENDING with **Update Result**), then **Import Working Result**
2. Excel file: choose the file
3. Import
4. Search `<asset>` in the Details tab
5. Tick the asset and click **Update Result**

## Expected
- Step 1: the selected assets show PENDING before the import
- Step 2 preview count matches the number of rows in the file
- Step 3 shows "The import record(s) have been successful."
- Step 4: all imported assets count as SIGHTED; a representative asset shows WORKING, HTD Follow-up "No Further Action", FSSC Outcome "Working condition"
- Step 5: Update Result is pre-loaded with Sighted Result SIGHTED, Asset Condition WORKING and HTD Follow-up "No Further Action"

## Notes
Covers BUG-007, verified on 2026-10-21 (the import first cleared the result, then saved "Sighted" instead of SIGHTED so Update Result showed no Sighted Result): the test must pass. The asset starts PENDING so that an earlier result cannot make step 4 pass; cleanup sets it back to PENDING.

Automated in tests/e2e/stocktake-fave/fave-import.spec.ts.
