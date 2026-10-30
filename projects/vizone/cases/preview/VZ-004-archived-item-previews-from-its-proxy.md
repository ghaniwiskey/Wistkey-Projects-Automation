---
id: VZ-004
title: "Archived item previews from its proxy"
feature: preview
priority: P1
tags: [regression, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
An item whose high-res file is in the archive (Scality or NAS) can still be previewed.

## Preconditions
- At least one video item with Archive policy Scality or NAS exists

## Data
- Item: the first video item with Archive policy Scality (or NAS), found at runtime

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the VZ_ADMIN_USER / VZ_ADMIN_PASS account
2. Open Search > Items, open the Archive policy facet and select Scality
3. Open the first result that has a duration (video)
4. Open the Files tab
5. Press Play/Pause in the player

## Expected
- The Files tab lists a Highres file in Scality Archive (or the NAS location) and a Proxy file in Video LR
- The player starts and the time code advances within 3 seconds
- No error message is shown in the player

## Notes
From the user feedback report 28 Oct 2026 (CNCA 1 "archived files"); see context.md > Known user issues. Asset media status has no "archived" value; archive is shown by Archive policy and the Files tab locations.
