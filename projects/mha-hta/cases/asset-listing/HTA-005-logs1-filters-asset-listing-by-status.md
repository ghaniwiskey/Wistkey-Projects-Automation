---
id: HTA-005
title: "LOGS1 filters Asset Listing by Status"
feature: asset-listing
priority: P1
tags: [regression]
envs: [staging]
automated: true
created: 2026-10-07
updated: 2026-10-07
---

## Goal
The Status filter narrows the listing to assets in that status.

## Preconditions
- Logged in as the test account (`HTA_USER` in .env) with Logistics Officer 1 active

## Data
- Status: NEW

## Steps
1. Open **Asset > Listing** and note the total record count.
2. Pick **NEW** in the **Status** filter and click **Search**.
3. Click **Clear**.

## Expected
- After step 2 the total record count is lower than the unfiltered total and every row on the page shows status NEW.
- After step 3 the filter is reset and the unfiltered total from step 1 is shown again.

## Notes
Filters apply only when Search is clicked, not on change (observed on SPF UAT).

Automated in tests/e2e/asset-listing/asset-listing.spec.ts (page objects in tests/pages).
