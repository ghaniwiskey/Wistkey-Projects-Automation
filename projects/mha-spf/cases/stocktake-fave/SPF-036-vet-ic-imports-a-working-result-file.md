---
id: SPF-036
title: "VET IC imports a working result file and the assets become SIGHTED / WORKING"
feature: stocktake-fave
priority: P1
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
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
1. Open the FAVE on `<cc>`, Details tab, **Import Working Result**
2. Excel file: choose the file
3. Import
4. Search `<asset>` in the Details tab

## Expected
- Step 2 lists row 1 with `<asset>`
- Step 3 shows "The import record(s) have been successful."
- Step 4: Result & Condition shows SIGHTED and WORKING, HTD Follow-up "No Further Action", FSSC Outcome "Working condition"

## Notes
Known bug BUG-007 (the result is cleared instead): the test is marked as expected to fail. Cleanup sets the asset back to PENDING.

Automated in tests/e2e/stocktake-fave/fave-import.spec.ts.
