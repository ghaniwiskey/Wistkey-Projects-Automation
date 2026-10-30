---
id: VZ-006
title: "Video item preview plays sound"
feature: audio
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
The proxy preview of a video item has working audio, not only picture.

## Preconditions
- At least one video item whose Overview Audio is PCM exists

## Data
- Item: the first Online video item with audio, found at runtime

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the VZ_ADMIN_USER / VZ_ADMIN_PASS account
2. Open the first Online video item from Search > Items
3. Make sure Mute/Unmute shows the item is not muted
4. Press Play/Pause and listen for 10 seconds

## Expected
- Sound is heard together with the picture for the whole 10 seconds
- The Files tab lists at least one Audio LR proxy file for the item

## Notes
From the user feedback report 28 Oct 2026 (ENCA 2, CNCA 3); see context.md > Known user issues. Automation can check that decoded audio grows during playback (the player is an HTML5 video element).
