---
id: MHM-013
title: "Asset Registration completes a PROGRESS asset from the phone"
feature: registration
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-16
updated: 2026-10-16
---

## Goal
LOGS1/FALO completes the location of a partially registered asset on the phone; MHA web shows it registered.

## Preconditions
- A PROGRESS asset in a cost centre the mobile officer holds LOGS1 or FALO for

## Data
- Asset: first one in the phone's Register Asset list

## Steps
1. Mobile: LOGS1 and the cost centre > Asset Registration
2. Open the first asset, keep the postal code, type Level and Remarks, Save
3. MHA web: the asset's status and Location

## Expected
- Step 2: the asset leaves the Register Asset list
- Step 3: the asset is no longer PROGRESS and its Location has the typed Level and Remarks

## Notes
Not automated: UAT has no PROGRESS asset in the mobile officer's units (2026-10-16: 6 PROGRESS assets, all in 332300 CID, not offered to the mobile account; its Register Asset list is "(0)"). Completing cannot be undone, so each run uses an asset up.
