---
id: VZ-031
title: "Typing a time code jumps the player to that frame"
feature: preview
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Editors can go straight to a known time code in a long item.

## Preconditions
- At least one video item of 1 hour or longer exists

## Data
- Time code: Start TC + about 8 minutes (e.g. 10:00:00:00 for Start TC 09:51:31:20)

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the VZ_ADMIN_USER / VZ_ADMIN_PASS account
2. Open Search > Items, sort by Media Duration and open the first video item of 01:00:00:00 or longer
3. Click the time code, press Enter, type the time code and press Enter

## Expected
- The time code shows the typed value
- The picture changes to that position

## Notes
Player time codes are Start TC based, not 00:00:00:00 based.
