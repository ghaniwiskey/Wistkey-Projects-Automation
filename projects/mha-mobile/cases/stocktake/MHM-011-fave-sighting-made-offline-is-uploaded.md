---
id: MHM-011
title: "FAVE sighting made offline is uploaded after reconnecting and shows on MHA web"
feature: stocktake
priority: P1
tags: [regression, writes]
envs: [all]
automated: true
created: 2026-10-16
updated: 2026-10-16
---

## Goal
A stocktaker downloads a FAVE for OFFLINE MODE, sights an asset without network, and submits it once the network is back; MHA web gets the result.

## Preconditions
- As MHM-005 (VET IC web account, mobile officer as stocktaker)

## Data
- Asset: as MHM-005 (fixture faveTarget); remarks QA auto mobile offline <unique>

## Steps
1. Mobile: log in, Stocktaker and the cost centre, Stocktake > the FAVE > CONFIRM (offline) > CONTINUE
2. Turn off Wi-Fi and mobile data
3. Open the asset, turn on Sighted, type the remarks, SAVE > CONFIRM; open REVIEW
4. Turn the network back on; REVIEW > Submit
5. MHA web: FAVE > cost centre > Details > the asset > Update Result
6. Cleanup: result back to PENDING

## Expected
- Step 1: "All data assets has been downloaded" with CONTINUE
- Step 3: the sighting is saved without network (REVIEW 1) and REVIEW has no Submit button while offline
- Step 4: Submit shows once the network is back; REVIEW goes to 0
- Step 5: SIGHTED WORKING, No Further Action, Working condition, the mobile officer as Stocktaker, the typed remarks, FAVE Status CLOSED

## Notes
Automated in tests/e2e/stocktake/fave-offline.spec.ts.
Network is switched with adb (svc wifi/data); the test turns it back on whatever happens. Lead for the reported submit "network error": not reproduced (2026-10-16).
