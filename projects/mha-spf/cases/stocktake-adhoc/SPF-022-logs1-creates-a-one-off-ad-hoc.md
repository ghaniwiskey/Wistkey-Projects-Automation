---
id: SPF-022
title: "LOGS1 creates a one-off ad hoc stocktake, records a result and assigns a stocktaker"
feature: stocktake-adhoc
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-06
updated: 2026-10-06
---

## Goal
LOGS1 can set up a one-off ad hoc stocktake with manually chosen assets, then update the sighting result and the ad hoc stocktaker in Ad Hoc Listing.

## Preconditions
- Logged in as SPF-A2216GA with Logistics Officer 1 active

## Data
- Asset 111000020724 (APD fire alarm system, LOGS1 Wong Pui Lai Annie)
- Stocktake Name `QA auto adhoc <unique>`
- Stocktaker Chia Shu Hui

## Steps
1. Open **Stocktake > Ad Hoc Setup**, click **Create**, pick **One-Off** and **Manual**, click **Next** without a name
2. Type the Stocktake Name and Remarks `QA test, please ignore`, **Next**
3. Click **Next** without ticking an asset
4. Search **111000020724**, tick it, **Next**, check the Review list, **Submit**
5. Open **Ad Hoc Setup**, search the new number and read the row
6. Open **Stocktake > Ad Hoc Listing**, open the new number, read the **Summary** tab
7. Open **Details**, tick the asset, **Update Result**, pick **SIGHTED**, type remarks, **Submit**
8. Open **Assignment**, tick the asset, **Assign Stocktaker**, pick **Chia Shu Hui**, **Submit**

## Expected
- Step 1 shows "Stocktake Name is required"; One-Off hides Recurrence Type, Number of Recurrence and Start Date
- Step 3 shows "Please tick at least one asset to process."
- Step 4: the counter shows "1 asset(s) selected", Review lists 111000020724 and the End step shows "Ad Hoc Stocktake No. ADST<number> has been created"
- Ad Hoc Setup lists the number with the name, MANUAL, ONE-OFF and status SUBMITTED
- Ad Hoc Listing lists it; its Summary shows PENDING with count 1
- Step 7 shows "The stocktake has been updated." and the Summary shows SIGHTED with count 1
- Step 8 shows "The stocktaker has been assigned." and the Ad Hoc Stocktaker column shows Chia Shu Hui

## Notes
Leaves one SUBMITTED ad hoc stocktake per run: SUBMITTED setups have no Cancel button for LOGS1 or Agency Admin. Names start with "QA auto".
