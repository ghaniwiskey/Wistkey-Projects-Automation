---
id: VZ-035
title: "Mute and unmute the preview"
feature: audio
priority: P3
tags: [regression]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Editors can silence the preview and get the sound back.

## Preconditions
- A video item with audio exists

## Data
- Item: first Online video item

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the VZ_ADMIN_USER / VZ_ADMIN_PASS account
2. Open the item and press Play
3. Press Mute/Unmute
4. Press Mute/Unmute again

## Expected
- After the first press the sound stops while the picture keeps playing
- After the second press the sound comes back
