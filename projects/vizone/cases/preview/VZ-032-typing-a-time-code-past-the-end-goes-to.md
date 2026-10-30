---
id: VZ-032
title: "Typing a time code past the end goes to the last frame"
feature: preview
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Out-of-range time codes do not break the player.

## Preconditions
- At least one video item of 1 hour or longer exists

## Data
- Time code: 23:59:59:24

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the VZ_ADMIN_USER / VZ_ADMIN_PASS account
2. Open Search > Items, sort by Media Duration and open the first video item of 01:00:00:00 or longer
3. Click the time code, press Enter, type 23:59:59:24 and press Enter

## Expected
- The time code shows the last frame (Start TC + Duration)
- The player still plays when Play/Pause is pressed after jumping back to the start

## Notes
On 2026-10-30 the 2h15m item went to 12:07:08:05.
