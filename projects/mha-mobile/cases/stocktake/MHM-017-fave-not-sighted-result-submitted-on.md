---
id: MHM-017
title: "FAVE not sighted result submitted on the mobile app opens an investigation on MHA web"
feature: stocktake
priority: P1
tags: [regression, writes]
envs: [all]
automated: true
created: 2026-10-16
updated: 2026-10-16
---

## Goal
A stocktaker records an asset as not sighted on the phone; MHA web shows NOT SIGHTED with the default follow-up "Not Found, for Investigation" and an open FAVE item.

## Preconditions
- The mobile account holds Stocktaker on a cost centre of the current FAVE
- The web account holds Verification Team IC/2IC on that cost centre

## Data
- FAVE asset: as MHM-005 (fixture faveTarget: the first PENDING asset of the officer, or an unassigned one that the test assigns)
- Remarks: QA auto mobile not sighted <unique>

## Steps
1. MHA web (VET IC): the asset is PENDING with the mobile officer as stocktaker
2. Mobile: Stocktaker | cost centre > Stocktake > the FAVE (online) > the asset
3. Leave Sighted off, type the remarks, SAVE
4. REVIEW > Submit
5. MHA web: FAVE Details row and Update Result of the asset
6. Cleanup: set the result back to PENDING

## Expected
- Step 3: with Sighted off, Asset Condition offers no values; SAVE stores it without a question and REVIEW shows 1
- Step 4: REVIEW goes back to 0
- Step 5: Result NOT SIGHTED, HTD Follow-up "Not Found, for Investigation", FSSC Outcome "Under investigation", stocktaker the mobile officer
- Step 5: Update Result: FAVE Status OPEN, Location Status CLOSED, Remarks as typed on the phone

## Notes
The phone has no HTD Follow-up field; the server fills "Not Found, for Investigation" (manual outcome h, Open).
Automated in tests/e2e/stocktake/fave-outcomes.spec.ts.
