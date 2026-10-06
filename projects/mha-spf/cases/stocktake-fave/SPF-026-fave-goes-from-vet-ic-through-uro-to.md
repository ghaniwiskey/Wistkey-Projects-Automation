---
id: SPF-026
title: "FAVE goes from VET IC through URO to UAO, and UAO rejects it back to URO"
feature: stocktake-fave
priority: P1
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
The approval chain VET IC > URO > UAO: each level submits to the next, and a UAO rejection returns the FAVE to the URO.

## Preconditions
- The test account holds VET IC, URO and UAO (SPF-A2216GA)
- The current FAVE for 332600 APD is with VET IC (Submit button shown to VET IC); the test puts it back there before and after

## Data
- Cost centre 332600 APD
- UAO reject reason Others, remarks `QA auto fave uao reject <unique>`

## Steps
1. As **Verification Team IC/2IC** submit the FAVE of 332600 APD (Submit, Yes)
2. As **Unit Resource Officer** open it, click **Submit**, answer **Yes**
3. As **Unit Approving Officer** open it and read the Summary
4. Click **Reject**, pick **Others**, type the remarks, **Submit**, answer **Yes**
5. As **Unit Resource Officer** open it again

## Expected
- Step 2 shows "Stocktake FAVE has been submitted."; the Unit Resource Officer stage shows SUBMITTED and URO has no Submit/Reject
- As UAO the Summary shows **Approve** and **Reject**
- Step 4 shows "Stocktake FAVE has been rejected."; the Unit Approving Officer stage shows REJECTED with the remarks; UAO has no Approve/Reject any more
- The URO sees **Submit** and **Reject** again (the FAVE is back with the URO)

## Notes
Cleanup: URO rejects it back to VET IC. UAO Approve is not tested (goes to HQ AO, see SPF-025).

Automated in tests/e2e/stocktake-fave/fave-approval.spec.ts (FavePage approval methods; fixture returnFaveToVetIc rejects the FAVE back to VET IC before and after).
