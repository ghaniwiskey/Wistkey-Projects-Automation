---
id: VZ-002
title: "Preview of a one to two hour item starts playing promptly"
feature: preview
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
An editor can preview a long program item in Studio without the player hanging.

## Preconditions
- At least one video item of 1 hour or longer exists (search Items sorted by Media Duration)

## Data
- Item: the longest Online video item, found at runtime

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the VZ_ADMIN_USER / VZ_ADMIN_PASS account
2. Open Search > Items and sort by Media Duration
3. Open the first video item whose duration is 01:00:00:00 or longer
4. Press Play/Pause in the item player
5. Wait 5 seconds and press Play/Pause again

## Expected
- The item page shows the player within 5 seconds of opening the item
- The player duration matches the Duration in the Overview (e.g. 02:15:36:11)
- After pressing Play the time code advances within 3 seconds and keeps advancing (no frozen frame or endless spinner)
- Pressing Play/Pause again stops the time code

## Notes
From the user feedback report 28 Oct 2026 (CNCA 1, ENCA 1); see context.md > Known user issues. Timing targets are proposals until Q-001 is answered. On 2026-10-30 a 2h15m item played at once.
