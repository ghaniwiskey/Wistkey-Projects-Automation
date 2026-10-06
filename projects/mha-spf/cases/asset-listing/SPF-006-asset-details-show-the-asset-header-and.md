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
- Asset ID: `111000010978`

## Steps
1. In **Asset > Listing**, search for `111000010978`.
2. Click the asset ("Asset ID: ..." link).
3. Open the **Location** tab.
4. Open the **Ownership** tab.

## Expected
- After step 2 the URL is `/Asset/AssetForm?assetId=...`, the breadcrumb ends with "Details", and the header shows Asset ID 111000010978, Asset Status AVAILABLE, Asset Category "1KZ0 / Mechanical & Electrical System of Building" and Cost Centre "332600 / APD".
- Tabs Main Data (selected), Location, Ownership, Loan, Maintenance and Retirement are shown; Main Data shows Acquisition Value "$26,145.00".
- The Location tab shows Group / NPC / Base and the postal code of the asset location.
- The Ownership tab shows "Current LOGS1" and "Current FALO".

## Notes
The page also has a 7th tab "Status" not described in the manual.

Automated in tests/e2e/asset-listing/asset-listing.spec.ts (page objects in tests/pages). Passed 2 runs in a row on 2026-10-06.
