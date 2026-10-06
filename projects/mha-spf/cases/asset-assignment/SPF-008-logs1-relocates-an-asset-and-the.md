---
id: SPF-008
title: "LOGS1 relocates an asset and the relocation is auto-approved"
feature: asset-assignment
priority: P0
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
A relocation transaction is approved by the system immediately and updates the asset location.

## Preconditions
- Logged in as SPF-A2216GA with Logistics Officer 1 active
- Asset `<asset>` is not in an ongoing transaction

## Data
- Asset `<asset>`: found when the test runs (writableAsset): selectable in Assign > Choose Asset, preferably with the test account as current LOGS1; all assignment write tests of a run share it (UAT 2026-10-06: `<asset>`)
- Location remarks: `QA relocate <unique>`

## Steps
1. Open **Asset > Assignment**, click **Create**, choose **Relocate** and click **Next**.
2. Search for `<asset>`, tick it and click **Next** twice (Choose Asset, Review).
3. On the location step keep Group "APD" and Postal Code "819645", set **Remarks** to `QA relocate <unique>` and click **Submit**.
4. Open **Asset > Assignment** and search for the new transaction number.
5. Open asset `<asset>` from **Asset > Listing** and go to the **Location** tab.

## Expected
- After step 3 the End step shows "Relocation request #ASG<number> is created" and "1 Asset is processed for Asset Relocation."
- The transaction is listed as type RELOCATE with status APPROVED.
- The asset Location tab shows Remarks `QA relocate <unique>`.

## Notes
Before and after: cancel any SUBMITTED assignment transaction on asset `<asset>` (owner Cancel, reason Others "QA cleanup"). No revert needed: each run sets new remarks.

Automated in tests/e2e/asset-assignment/assignment-writes.spec.ts (page objects in tests/pages, cleanup fixtures in tests/fixtures/pages.fixture.ts).
