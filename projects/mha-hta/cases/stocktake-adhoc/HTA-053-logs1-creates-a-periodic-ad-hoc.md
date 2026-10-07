---
id: HTA-053
title: "LOGS1 creates a periodic ad hoc stocktake with Random selection limited by Status and Max Asset"
feature: stocktake-adhoc
priority: P1
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-07
updated: 2026-10-07
---

## Goal
LOGS1 can let the app pick the assets of an ad hoc stocktake at random, narrowed by the Status filter and capped by Max Asset, and the setup keeps exactly the assets shown in Review.

## Preconditions
- Logged in as the test account (`HTA_USER` in .env) with Logistics Officer 1 active
- The unit has more AVAILABLE assets than Max Asset (checked when the test runs; skipped otherwise)

## Data
- Stocktake Name `QA auto adhoc random <unique>`, Recurrence Type MONTHLY (Number of Recurrence and Start Date keep their defaults: 1, tomorrow)
- Status filter AVAILABLE, Max Asset 3

## Steps
1. Open **Stocktake > Ad Hoc Setup**, click **Create**, pick **Periodic** and **Random**, type the name, Recurrence Type **MONTHLY**, Remarks `QA test, please ignore`, **Next**
2. On Choose Asset click **Next** without searching
3. Pick Status **AVAILABLE** (no Max Asset), click **Search** and read Total Number of Assets
4. Type Max Asset **3**, click **Search**
5. Click **Next** and read the Review list
6. Click **Submit**
7. Open **Ad Hoc Setup**, search the new number, read the row, open it
8. Open **Stocktake > Ad Hoc Listing**, open the new number, read **Summary** and **Details**

## Expected
- Step 2 shows "Please click Search button to ensure there is asset(s) based on filter(s) selected."
- Step 3: Total Number of Assets is more than 3 (otherwise the test is skipped)
- Step 4: Total Number of Assets is 3 and Total Group / NPC / Base is between 1 and 3
- Step 5: Review lists 3 assets, each with status AVAILABLE
- Step 6: the End step shows "Ad Hoc Stocktake No. ADST<number> has been created"
- Ad Hoc Setup lists the number with the name, RANDOM, MONTHLY, PERIODIC and status CREATED; its details show Asset Selection RANDOM and Max Asset 3
- Ad Hoc Listing Summary shows PENDING with count 3, and Details lists the same 3 asset IDs as Review

## Notes
Periodic (not one-off) so the CREATED setup can be cancelled afterwards (one-off cannot, mha-spf BUG-002); the afterEach cleanup cancels it with reason OTHER (mha-spf BUG-001 workaround). Random picks differ per search, so the test compares Review with the saved setup instead of fixed IDs. Without a Status filter, Random also picks RETIRED / DISPOSED assets.

Automated in tests/e2e/stocktake-adhoc/adhoc.spec.ts (page objects tests/pages/adhoc.page.ts: AdHocCreatePage.filterStatus / randomSearch / reviewAssets, AdHocSetupPage.detailValue, AdHocListingPage.detailAssetIds).
