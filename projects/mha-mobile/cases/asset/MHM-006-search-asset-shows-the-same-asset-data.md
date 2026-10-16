---
id: MHM-006
title: "Search Asset shows the same asset data as MHA web"
feature: asset
priority: P1
tags: [regression]
envs: [all]
automated: true
created: 2026-10-16
updated: 2026-10-16
---

## Goal
The mobile asset search returns the asset with the same master and location data as MHA web Asset Details.

## Preconditions
- The web account holds Logistics Officer 1
- The mobile account holds Stocktaker

## Data
- Asset: first AVAILABLE asset in MHA web Asset Listing (LOGS1) whose cost centre the phone offers; the phone switches to that cost centre (the search only covers the active one)

## Steps
1. MHA web as LOGS1: Asset Listing, Status AVAILABLE, open the first asset and read Main Data and Location
2. Mobile: log in, switch to Stocktaker and the asset's cost centre, tap Search Asset
3. Type the Asset ID and tap Search
4. Open the result

## Expected
- Step 3: one result with "Asset Desc 1: <description>", "Asset Serial No: <serial>" and "Asset ID 2: <id 2>"
- Step 4: Asset No., Asset ID 2, Serial Number, Asset Category (code), Capitalisation Date, Acquisition Value (same amount), Description and Asset Status equal MHA web
- Step 4: Group/NPC/Base (code), building, address, postal code, Block, Level, Room and Asset Location Remarks equal MHA web Location; Sensitivity matches Asset Sensitivity

## Notes
Automated in tests/e2e/asset/search-asset.spec.ts (screen objects tests/pages/mobile, web page objects tests/pages/web).
Read-only. Formats differ between the apps and are compared as values: "$26145.0" vs "$26,145.00", category "1KZ0" vs "1KZ0 / ...", group "APD" vs "Airport Police Division (APD)". An asset of another cost centre gives an empty result with no message.
