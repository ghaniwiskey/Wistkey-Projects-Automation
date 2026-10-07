---
id: HTA-019
title: "VET IC views the active FAVE for a unit and exports it"
feature: stocktake-fave
priority: P1
tags: [regression]
envs: [staging]
automated: true
created: 2026-10-07
updated: 2026-10-07
---

## Goal
VET IC can open the current FAVE stocktake, see one cost centre's approval panel, results summary and assets, and download the FAVE report.

## Preconditions
- Logged in as the test account (`HTA_USER` in .env) with Verification Team IC/2IC active
- A FAVE stocktake exists with at least one cost centre (HTA UAT 2026-10-07: FAVE FY26-9001)

## Data
- Cost centre `<cc>`: the first cost centre of the current FAVE that is not APPROVED (found when the test runs; the test skips when all are approved)
- Asset `<asset>`: the first asset in its Details tab

## Steps
1. Open **Stocktake > FAVE** and click the pencil of the first FAVE
2. Click the first cost centre row that is not APPROVED (`<cc>`)
3. On the **Summary** tab, read the approval panel and the results table
4. Open the **Details** tab and search the first asset
5. Back on **Summary**, click **Export**

## Expected
- The list shows FAVE numbers in the format "FAVE FYaa-90cc" (HTA agency code 90) and the details heading reads "Stocktake FAVE #FAVE FY..."
- The cost centre table lists at least one cost centre; after picking `<cc>` the Summary shows the approval panel Verification Team IC/2IC, Unit Resource Officer, Unit Approving Officer (the buttons depend on the approval state)
- The Summary results table has at least one row (Sighted Result and Count)
- The Details search returns exactly the asset with a Sighted Result (PENDING, SIGHTED or NOT SIGHTED)
- Export downloads StocktakeFAVEReport_<timestamp>.xlsx that contains the asset

## Notes
Read-only. Does not click Submit: that sends the whole unit's FAVE to the URO and emails people (manual > Follow up > How to approve FAVE). The FAVE number changes every financial year; the test opens the first one in the list.

Automated in tests/e2e/stocktake-fave/fave.spec.ts (page objects tests/pages/fave.page.ts and stocktake-form.page.ts; Excel check via shared/utils/xlsx.ts).
