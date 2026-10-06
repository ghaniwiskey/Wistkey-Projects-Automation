---
id: SPF-041
title: "FALO closes an open FAVE follow-up item"
feature: stocktake-follow-up
priority: P1
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
Open items raised in an approved FAVE (manual Part IV) can be closed from Stocktake > Follow up, and a closed item leaves the list.

## Preconditions
- Logged in as the test account (`SPF_USER` in .env) with Fixed Asset Liaison Officer active
- At least one open follow-up item (the test skips when the list is empty)

## Data
- Item `<fave>` / `<asset>`: the first row of the Follow up list, found at runtime. Closing cannot be undone: each run uses one item up.

## Steps
1. Open **Stocktake > Follow up**, keep **Close Item** and click **Next**; note the number of records
2. Click **Next** without ticking anything
3. Tick the first item
4. Click **Next**
5. Click **Submit**
6. Open Follow up again, **Next**, search `<asset>`

## Expected
- Step 1: the Choose Asset list shows the open items (FAVE No, Asset, HTD Follow-up, FSSC Outcome, Follow-up Type)
- Step 2: "Please tick at least one asset to process."
- Step 3: "1 asset(s) selected" and the item leaves the list (records minus one)
- Step 4: Review lists only `<fave>` / `<asset>`
- Step 5: End step "Stocktake Follow-up Close" with "1 Asset has been closed."
- Step 6: the list still has one record less and `<fave>` / `<asset>` is not in it

## Notes
On UAT (2026-10-06) the list held 225 items from FAVE FY24-2001 (cost centre 332300). No reason or confirmation is asked before closing.

Automated in tests/e2e/stocktake-follow-up/follow-up.spec.ts (page object tests/pages/follow-up.page.ts).
