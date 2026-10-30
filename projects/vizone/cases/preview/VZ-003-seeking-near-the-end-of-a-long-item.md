---
id: VZ-003
title: "Seeking near the end of a long item plays without freezing"
feature: preview
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
An editor can jump to the last minutes of a long item and keep playing.

## Preconditions
- At least one video item of 1 hour or longer exists

## Data
- Item: the longest Online video item, found at runtime

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the VZ_ADMIN_USER / VZ_ADMIN_PASS account
2. Open Search > Items, sort by Media Duration and open the first video item of 01:00:00:00 or longer
3. Drag the Timeline slider to about 1 minute before the end
4. Press Play/Pause

## Expected
- The time code shows a value about 1 minute before Start TC + Duration within 3 seconds of the seek
- The picture updates to the new position and the time code advances after Play
- The browser tab stays responsive (other buttons still react)

## Notes
From the user feedback report 28 Oct 2026 (CNCA 1); see context.md > Known user issues. Seek took about 0.35 s on a 2h15m item on 2026-10-30.
