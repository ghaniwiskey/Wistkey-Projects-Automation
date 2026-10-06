---
id: SPF-034
title: "A sensitive asset (Asset Sensitivity Yes) cannot get new photos"
feature: asset-listing
priority: P1
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
Business rule: Asset Sensitivity YES disables photo upload for the asset.

## Preconditions
- Logged in as the test account (`SPF_USER` in .env) with Logistics Officer 1 active

## Data
- Asset `<asset>`: the first AVAILABLE asset that is not sensitive (found at runtime)
- Sensitivity remarks `<unique>`

## Steps
1. Open `<asset>`, click Edit asset (pencil next to the details), tick Asset Sensitivity **Yes**, Sensitivity Remarks `<unique>`, Submit
2. Reload; Main Data
3. Open Edit Picture and click an empty slot
4. Edit asset: untick Yes, Submit

## Expected
- After step 2 Main Data shows Asset Sensitivity "Yes" and Sensitivity Remarks `<unique>`
- Step 3 offers no Upload button (only Cancel)
- After step 4 Asset Sensitivity is "No" and Edit Picture offers Upload again

## Notes
The Edit asset dialog shows no message after Submit. Unticking Yes clears the remarks (shown as "-"). Cleanup sets Sensitivity back to No.

Automated in tests/e2e/asset-listing/asset-photos.spec.ts.
