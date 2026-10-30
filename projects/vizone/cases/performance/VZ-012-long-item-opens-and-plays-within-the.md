---
id: VZ-012
title: "Long item opens and plays within the target time during the 3 PM peak"
feature: performance
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Long program items stay usable during the daily peak.

## Preconditions
- Run once between 10:00 and 12:00 and once between 15:00 and 18:00 HKT on the same working day
- At least one video item of 1 hour or longer exists

## Data
- Item: the longest Online video item, found at runtime

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the VZ_ADMIN_USER / VZ_ADMIN_PASS account
2. Open the longest video item and note the time until the player shows the duration
3. Press Play/Pause and note the time until the time code advances
4. Repeat 3 times

## Expected
- The item page with player appears within 5 seconds
- Playback starts within 3 seconds
- The peak-hour median is no more than twice the morning median

## Notes
From the user feedback report 28 Oct 2026 (CNCA 2, ENCA 1); see context.md > Known user issues. Targets are proposals until Q-001 is answered.
