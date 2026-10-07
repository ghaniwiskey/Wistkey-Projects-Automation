---
id: HTA-037
title: "FAVE Import Template downloads the LMSAssetID template"
feature: stocktake-fave
priority: P2
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-07
updated: 2026-10-07
---

## Goal
Users can download the import template from the Import Working Result dialog.

## Preconditions
- Logged in as the test account (`HTA_USER` in .env) with Verification Team IC/2IC active
- A FAVE exists with a cost centre that is not APPROVED

## Data
- Cost centre `<cc>`: the first non-approved cost centre of the current FAVE (fixture faveTarget)

## Steps
1. Open the FAVE on `<cc>`, Details tab, Import Working Result
2. Click **Import Template**

## Expected
- A file named StocktakeFAVEWorkTemplate.zip is downloaded and it is a real zip archive (not an HTML page)

## Notes
BUG-003: the download is not the zip template on HTA either (same as mha-spf BUG-006); marked test.fail while BUG-003 is open. Tagged writes because the setup (fixture faveTarget) may reject the cost centre back to VET IC.

Automated in tests/e2e/stocktake-fave/fave-import.spec.ts.
