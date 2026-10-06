---
id: SPF-013
title: "LOGS1 registers a NEW asset with a complete location"
feature: asset-registration
priority: P0
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
The 7-step Register wizard turns a NEW asset into AVAILABLE when the location is complete.

## Preconditions
- Logged in as SPF-A2216GA with Logistics Officer 1 active
- At least one NEW asset exists for the unit (Asset Listing, Status NEW)

## Data
- Asset: the first NEW asset in Asset Listing (consumed: it stays AVAILABLE)
- Group: the first group offered for the asset (its unit's groups); the unit's postal code `<postal>` (Postal Code on the Location tab of the first AVAILABLE asset, found when the test runs) and the first address the search returns; Remarks `QA register <unique>`
- Sensitivity: NO; Tag printing: NO

## Steps
1. Open **Asset > Registration**, keep **Register** and click **Next**.
2. Search for the asset, tick it and click **Next** twice (Choose Asset, Review).
3. Leave the FALO assignee empty, pick the first Group, search Postal Code `<postal>` and pick the first address, Remarks `QA register <unique>`, click **Next**.
4. Keep Sensitivity **NO**, click **Next**.
5. Choose Tag Printing **NO** and click **Submit**.

## Expected
- Choosing Tag Printing NO sets Tag Type to NA.
- The End step shows "Asset Registration completed." and "1 Asset successfully registered."
- Asset Listing shows the asset with status AVAILABLE and its Location tab shows Remarks `QA register <unique>`.

## Notes
Consumes one NEW asset per run (iLMS data, cannot be reset from the UI). The test skips when no NEW asset is left.

Automated in tests/e2e/asset-registration/registration.spec.ts (page objects in tests/pages, cleanup fixtures in tests/fixtures/pages.fixture.ts).
