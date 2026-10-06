---
id: SPF-006
title: "Asset details show the asset header and the data tabs"
feature: asset-listing
priority: P0
tags: [smoke]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
Clicking an asset in the listing opens its details with the key fields and the 6 data tabs from the manual.

## Preconditions
- Logged in as SPF-A2216GA with Logistics Officer 1 active

## Data
- Asset `<asset>`: the first AVAILABLE asset in Asset Listing, found when the test runs (UAT 2026-10-06: 111000010977)

## Steps
1. In **Asset > Listing**, search for `<asset>`.
2. Click the asset ("Asset ID: ..." link).
3. Open the **Location** tab.
4. Open the **Ownership** tab.

## Expected
- After step 2 the URL is `/Asset/AssetForm?assetId=...`, the breadcrumb ends with "Details", and the header shows Asset ID <asset>, Asset Status AVAILABLE, an Asset Category and the Cost Centre shown in the listing.
- Tabs Main Data (selected), Location, Ownership, Loan, Maintenance and Retirement are shown; Main Data shows the Acquisition Value shown in the listing.
- The Location tab shows Group / NPC / Base and the postal code of the asset location.
- The Ownership tab shows "Current LOGS1" and "Current FALO".

## Notes
The page also has a 7th tab "Status" not described in the manual.

Automated in tests/e2e/asset-listing/asset-listing.spec.ts (page objects in tests/pages). Passed 2 runs in a row on 2026-10-06.
