---
id: SPF-043
title: "Agency Admin sees a unit FAVE result in FAVE(HQ) Overview, Details and export"
feature: stocktake-fave
priority: P1
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
HQ (Agency Admin) monitors every unit's FAVE in FAVE(HQ): a result recorded by the unit's VET IC shows up in the cost centre's FSSC Overview, Details and export, and HQ cannot change anything.

## Preconditions
- The test account (`SPF_USER` in .env) holds Verification Team IC/2IC and Agency Admin (the test skips without Agency Admin)
- A FAVE exists with a cost centre that is not APPROVED

## Data
- Cost centre `<cc>` and asset `<asset>`: as in SPF-020 (fixture faveTarget), set to PENDING first

## Steps
1. As VET IC open the first FAVE (note its number); switch to **Agency Admin** and open **Stocktake > FAVE(HQ)**, first FAVE
2. Search cost centre `<cc>` and select it; read the **Overview** and **Summary** tabs; note the Count of FA of legend **a**
3. Open **Details**, search `<asset>`
4. Switch to VET IC, FAVE, `<cc>`, Details: Update Result of `<asset>` to **SIGHTED** / **WORKING**, Submit
5. Switch to Agency Admin, FAVE(HQ), `<cc>`, Overview and Summary
6. Details, search `<asset>`
7. Overview **Export**
8. Cleanup: as VET IC set `<asset>` back to PENDING

## Expected
- Step 1: FAVE(HQ) opens the same FAVE number; its cost centre table lists the agency's cost centres
- Step 2: Overview has legends a to i, a = "Sighted - Working condition"; each legend's Count of FA equals the Summary count of the same Sighted Result and FSSC Outcome
- Step 3: the asset is PENDING; Details offers only Search and Clear (no Update Result, Import, Assign or Submit)
- Step 4: "The stocktake result is updated."
- Step 5: legend a count is one higher than in step 2; Overview still matches Summary
- Step 6: the row shows SIGHTED and WORKING
- Step 7: StktakeFAVEReport_<timestamp>.xlsx; the asset's row has `<cc>`, "a. Sighted - Working condition" and "No Further Action"

## Notes
The Export above the cost centre table exports the whole FAVE (all cost centres, several MB); not used here. Overview also shows "No. of Open Items for Unit's Follow-up".

Automated in tests/e2e/stocktake-fave/fave-hq.spec.ts (page object tests/pages/fave-hq.page.ts).
