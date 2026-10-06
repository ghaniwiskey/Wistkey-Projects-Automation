---
id: SPF-022
title: "LOGS1 creates a one-off ad hoc stocktake, records a result and assigns a stocktaker"
feature: stocktake-adhoc
priority: P1
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
LOGS1 can set up a one-off ad hoc stocktake with manually chosen assets, then update the sighting result and the ad hoc stocktaker in Ad Hoc Listing.

## Preconditions
- Logged in as the test account (`SPF_USER` in .env) with Logistics Officer 1 active

## Data
- Asset `<asset>`: the first asset in Choose Asset, found when the test runs
- Stocktake Name `QA auto adhoc <unique>`
- Stocktaker `<stocktaker>`: the first name in the Assign dropdown that is not the current (default) stocktaker

## Steps
1. Open **Stocktake > Ad Hoc Setup**, click **Create**, pick **One-Off** and **Manual**, click **Next** without a name
2. Type the Stocktake Name and Remarks `QA test, please ignore`, **Next**
3. Click **Next** without ticking an asset
4. Tick the first asset `<asset>`, **Next**, check the Review list, **Submit**
5. Open **Ad Hoc Setup**, search the new number and read the row
6. Open **Stocktake > Ad Hoc Listing**, open the new number, read the **Summary** tab
7. Open **Details**, tick the asset, **Update Result**, pick **SIGHTED**, type remarks, **Submit**
8. Open **Assignment**, tick the asset, **Assign Stocktaker**, pick **`<stocktaker>`**, **Submit**
9. Open **Ad Hoc Setup** again and search the number

## Expected
- Step 1 shows "Stocktake Name is required"; One-Off hides Recurrence Type, Number of Recurrence and Start Date
- Step 3 shows "Please tick at least one asset to process."
- Step 4: the counter shows "1 asset(s) selected", Review lists `<asset>` and the End step shows "Ad Hoc Stocktake No. ADST<number> has been created"
- Ad Hoc Setup lists the number with the name, MANUAL, ONE-OFF and status CREATED
- Ad Hoc Listing lists it; its Summary shows PENDING with count 1
- Step 7 shows "The stocktake has been updated." and the Summary shows SIGHTED with count 1
- Step 8 shows "The stocktaker has been assigned." (no confirmation, unlike FAVE) and the Ad Hoc Stocktaker column shows `<stocktaker>`
- After step 9 the status is SUBMITTED (a result has been recorded)

## Notes
Leaves one ad hoc stocktake per run: one-off setups cannot be cancelled ("Can't cancel one-off stocktake type.", see BUG-002) and SUBMITTED ones have no Cancel button. Names start with "QA auto adhoc".

Automated in tests/e2e/stocktake-adhoc/adhoc.spec.ts (page objects tests/pages/adhoc.page.ts and stocktake-form.page.ts).
