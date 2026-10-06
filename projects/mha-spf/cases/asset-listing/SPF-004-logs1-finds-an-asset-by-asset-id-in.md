---
id: SPF-004
title: "LOGS1 finds an asset by Asset ID in Asset Listing"
feature: asset-listing
priority: P0
tags: [smoke]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
A Logistics Officer 1 can find a specific asset of their unit by its Asset ID.

## Preconditions
- Logged in as SPF-A2216GA with Logistics Officer 1 active (Agency Admin cannot search reliably: too many assets, the listing hangs)

## Data
- Asset ID: `111000010978` (AVAILABLE, cost centre 332600 APD, "VARIABLE REFRIGERANT VOLUME AIR CON(VRV)")

## Steps
1. Open **Asset > Listing**. -> Expect: heading "Listing" and a list of assets ("Showing 1 to 10 of N records", N > 1).
2. Type `111000010978` into the search box "Asset ID/Asset ID2/Serial No/Desc" and click **Search**.

## Expected
- The table shows exactly 1 record ("Showing 1 to 1 of 1 records").
- The row shows "Asset ID: 111000010978", the description "VARIABLE REFRIGERANT VOLUME AIR CON(VRV)", cost centre 332600 and status AVAILABLE.

## Notes
Asset data comes from iLMS; if this asset changes status or unit, pick another AVAILABLE asset and update tests/utils/test-data.ts and context.md.

Automated in tests/e2e/asset-listing/asset-listing.spec.ts (page objects in tests/pages). Passed 2 runs in a row on 2026-10-06.
