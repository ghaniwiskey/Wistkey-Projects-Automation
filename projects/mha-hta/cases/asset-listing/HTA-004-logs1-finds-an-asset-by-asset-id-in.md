---
id: HTA-004
title: "LOGS1 finds an asset by Asset ID in Asset Listing"
feature: asset-listing
priority: P0
tags: [smoke]
envs: [staging]
automated: true
created: 2026-10-07
updated: 2026-10-07
---

## Goal
A Logistics Officer 1 can find a specific asset of their unit by its Asset ID.

## Preconditions
- Logged in as the test account (`HTA_USER` in .env) with Logistics Officer 1 active (Agency Admin cannot search reliably: too many assets, the listing hangs)

## Data
- Asset `<asset>`: the first AVAILABLE asset in Asset Listing, found when the test runs

## Steps
1. Open **Asset > Listing**. -> Expect: heading "Listing" and a list of assets ("Showing 1 to 10 of N records", N > 1).
2. Type `<asset>` into the search box "Asset ID/Asset ID2/Serial No/Desc" and click **Search**.

## Expected
- The table shows exactly 1 record ("Showing 1 to 1 of 1 records").
- The row shows "Asset ID: <asset>", the description, cost centre and status AVAILABLE shown for it in the listing.

## Notes
Asset data comes from iLMS; if this asset changes status or unit, pick another AVAILABLE asset and update tests/utils/test-data.ts and context.md.

Automated in tests/e2e/asset-listing/asset-listing.spec.ts (page objects in tests/pages).
