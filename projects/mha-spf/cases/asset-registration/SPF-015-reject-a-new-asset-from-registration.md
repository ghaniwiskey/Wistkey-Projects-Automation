---
id: SPF-015
title: "Reject a NEW asset from registration and reinstate it"
feature: asset-registration
priority: P1
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
A wrongly rejected asset can be reinstated and returns to its previous status (NEW).

## Preconditions
- Logged in as SPF-A2216GA with Logistics Officer 1 active
- At least one NEW asset exists

## Data
- Asset: the first NEW asset in Asset Listing (restored to NEW)
- Reject reason: Wrongly Capitalised
- Reinstate reason: Wrongly Rejected

## Steps
1. Open **Asset > Registration**, choose **Reject**, select the asset, **Next** twice.
2. Pick Reject Reason **Wrongly Capitalised** and **Submit**.
3. Open **Asset > Rejection**, keep **Reinstate**, **Next**, select the asset, **Next** twice.
4. Pick reason **Wrongly Rejected** and **Submit**.

## Expected
- After step 2 the End step shows "Assets Rejected." and "1 Asset rejected from Registration."; the asset is listed in the Reinstate list with Rejected By "Wong Pui Lai Annie".
- After step 4 the End step shows "Reinstatement Completed" and "1 asset has been reinstated and is pending registration."
- Asset Listing shows the asset with status NEW again.

## Notes
Non-consuming. Observed 2026-10-06: an asset rejected from PROGRESS is reinstated to PROGRESS (previous status), not NEW. If the test fails between the two steps it reinstates the asset in cleanup.

Automated in tests/e2e/asset-registration/registration.spec.ts (page objects in tests/pages, cleanup fixtures in tests/fixtures/pages.fixture.ts).
