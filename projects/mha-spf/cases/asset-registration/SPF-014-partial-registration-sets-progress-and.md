---
id: SPF-014
title: "Partial registration sets PROGRESS and Complete Register finishes it"
feature: asset-registration
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-06
updated: 2026-10-06
---

## Goal
Registering without Block/Level/Room No./Remarks leaves the asset PROGRESS; Complete Register with a remark makes it AVAILABLE.

## Preconditions
- Logged in as SPF-A2216GA with Logistics Officer 1 active
- At least one NEW asset exists

## Data
- Asset: the first NEW asset in Asset Listing (consumed)
- Group APD, Postal Code 819645, Block/Level/Room No./Remarks empty
- Complete Register remarks: `QA complete <unique>`

## Steps
1. Register the asset as in the full registration case but leave Block, Level, Room No. and Remarks empty; Tag Printing NO; **Submit**.
2. Check its status in **Asset > Listing**.
3. Open **Asset > Registration**, choose **Complete Register**, select the asset, **Next** twice.
4. Check the location is prefilled (Group APD, Postal Code 819645), set Remarks `QA complete <unique>` and **Submit**.

## Expected
- After step 1 the End step shows "Asset Registration incomplete." with "Please fill in either the Block, Level, Room No or Remarks ...".
- After step 2 the asset status is PROGRESS.
- After step 4 the End step shows "Asset Registration completed." and the asset status is AVAILABLE.

## Notes
Consumes one NEW asset per run. Skips when no NEW asset is left.
