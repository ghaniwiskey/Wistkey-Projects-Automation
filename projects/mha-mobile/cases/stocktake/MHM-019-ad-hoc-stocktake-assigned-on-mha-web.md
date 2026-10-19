---
id: MHM-019
title: "Ad hoc stocktake assigned on MHA web is sighted on the stocktaker's mobile app"
feature: stocktake
priority: P1
tags: [regression, writes]
envs: [all]
automated: true
created: 2026-10-16
updated: 2026-10-19
---

## Goal
An ad hoc stocktake whose asset is assigned to a stocktaker on MHA web reaches that stocktaker's phone (Stocktake (Ad Hoc) tile), and the sighting submitted from the phone shows on MHA web.

## Preconditions
- The web account holds Logistics Officer 1
- The mobile account holds Stocktaker on the asset's cost centre
- The Stocktaker role has the MOBILE function "Stocktake (Ad Hoc)" (MHA web > User > Role Listing > STOCKTAKER > Functions > MOBILE)

## Data
- Ad hoc stocktake: the newest one-off "QA auto mobile adhoc ..." in Ad Hoc Setup (created once with one asset of a unit where the mobile officer is Stocktaker; one-offs cannot be cancelled, so it is reused). UAT 2026-10-19: ADST00000036, asset 111000010977 (332600 APD)

## Steps
1. MHA web (LOGS1): Ad Hoc Listing > the stocktake > Assignment: Assign Stocktaker = the mobile officer (if not yet)
2. MHA web: Details: the asset is PENDING (Update Result PENDING if not)
3. Mobile: Stocktaker | the asset's cost centre > Stocktake (Ad Hoc)
4. Open the stocktake, CANCEL to "Will do stocktake by OFFLINE MODE?" (online); search the asset in SELECT
5. Open the asset, turn on Sighted, type the remarks, SAVE > CONFIRM "Set this asset as sighted?"
6. REVIEW > Submit
7. MHA web: Ad Hoc Listing > the stocktake > Details, and Update Result of the asset (Cancel)
8. Cleanup: Update Result PENDING

## Expected
- Step 3: "Stocktake (Ad Hoc) (n)" lists the stocktake ("Ad Hoc | Pending: n")
- Step 4: SELECT 1 / VERIFY 0 / REVIEW 0 and the asset under its location group
- Step 5: the asset moves to REVIEW (1)
- Step 6: "Submission Successful", REVIEW back to 0
- Step 7: the asset's Result is SIGHTED and Update Result shows the phone's remarks

## Notes
Automated in tests/e2e/stocktake/adhoc.spec.ts. The ad hoc detail on the phone has only Sighted, Remarks and the photo (no Asset Condition or location fields).
BUG-003 (verified 2026-10-19): the Stocktake (Ad Hoc) tile was missing because the Stocktaker role's MOBILE function was off on UAT, not an app defect.