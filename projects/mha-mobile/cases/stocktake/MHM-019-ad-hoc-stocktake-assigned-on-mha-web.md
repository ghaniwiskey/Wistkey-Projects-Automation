---
id: MHM-019
title: "Ad hoc stocktake assigned on MHA web reaches the stocktaker's mobile app"
feature: stocktake
priority: P1
tags: [regression, writes]
envs: [all]
automated: true
created: 2026-10-16
updated: 2026-10-16
---

## Goal
An ad hoc stocktake whose asset is assigned to a stocktaker on MHA web is listed on that stocktaker's phone (manual: Stocktake Adhoc > pick the list > Sighted / Not sighted > Save > REVIEW > Submit).

## Preconditions
- The web account holds Logistics Officer 1
- The mobile account holds Stocktaker on the same cost centre

## Data
- Ad hoc stocktake: the newest one-off "QA auto mobile adhoc" in Ad Hoc Listing (created once with one asset of the unit; one-offs cannot be cancelled, so it is reused)

## Steps
1. MHA web (LOGS1): Ad Hoc Listing > the stocktake > Assignment: Assign Stocktaker = the mobile officer (if not yet)
2. MHA web: Details: the asset is PENDING (Update Result PENDING if not)
3. Mobile: Stocktaker | the asset's cost centre; look at the home tiles and Stocktake

## Expected
- Step 3: the stocktaker can open the ad hoc stocktake on the phone (a Stocktake Adhoc tile, or the stocktake number in the Stocktake list)

## Notes
Fails on UAT 2026-10-16: BUG-003 (no Stocktake Adhoc tile for any role; the Stocktake list shows FAVEs only). Sighting and submit of an ad hoc asset from the phone are not covered until it is fixed.
Automated in tests/e2e/stocktake/adhoc.spec.ts (expected to fail while BUG-003 is open).
