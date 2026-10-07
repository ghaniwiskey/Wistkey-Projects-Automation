---
id: HTA-020
title: "VET IC updates a FAVE sighting result and HTD Follow-up is auto-mapped"
feature: stocktake-fave
priority: P0
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-07
updated: 2026-10-07
---

## Goal
VET IC can record a sighting result for a FAVE asset; HTD Follow-up, FSSC Outcome and statuses are filled from Sighted Result and Asset Condition (FSSC mapping), and the result can be set back to PENDING.

## Preconditions
- Logged in as the test account (`HTA_USER` in .env) with Verification Team IC/2IC active
- A FAVE exists with a cost centre that is not APPROVED

## Data
- Cost centre `<cc>`: the first cost centre in the current FAVE's table that is not APPROVED (never one reserved for HTA-027), brought back to VET IC first; asset `<asset>`: its first asset in the Details tab. Found when the test runs (fixture faveTarget); the test skips when every cost centre is approved.
- Sighted Result SIGHTED, Asset Condition WORKING
- Remarks `QA auto fave <unique>`

## Steps
1. Open the first FAVE, pick cost centre `<cc>`, open **Details** and search `<asset>`
2. Tick the asset and click **Update Result**
3. Pick Sighted Result **SIGHTED**, Asset Condition **WORKING**, type the Remarks and **Submit**
4. Search the asset again and read its row
5. Tick it, **Update Result**, check the pre-loaded values, pick Sighted Result **PENDING** and **Submit**

## Expected
- After step 3, before Submit: HTD Follow-up shows "No Further Action", FSSC Outcome "Working condition", FAVE Status "CLOSED", Correct Location ticked and Location Status "CLOSED"
- Submit shows "The stocktake result is updated."
- The row shows SIGHTED, WORKING, No Further Action and Working condition
- The Update Result dialog of a single asset is pre-loaded with SIGHTED, WORKING and the remarks typed in step 3
- After step 5 "The stocktake result is updated." is shown and the row shows PENDING again

## Notes
Writes to the live FAVE on UAT; step 5 restores the asset to PENDING, and cleanup resets it if the test stops halfway. Known cosmetic issue: after picking PENDING the Remarks box is cleared but its counter keeps the old count (e.g. "20 / 200").

Automated in tests/e2e/stocktake-fave/fave.spec.ts (afterEach resets the asset to PENDING with FavePage.ensurePending).
