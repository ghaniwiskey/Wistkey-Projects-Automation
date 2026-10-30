---
id: VZ-016
title: "Vizone clip shows its audio waveform and plays sound after import into Premiere"
feature: premiere-plugin
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Imported clips have working audio right away, without reloads.

## Preconditions
- A workstation with Premiere and the Vizone plugin

## Data
- A 1-2 hour program item and a short clip with audio

## Steps
1. Import each item via the Vizone panel
2. Place it on the timeline and expand the audio track
3. Play 10 seconds

## Expected
- The audio waveform is drawn within 30 seconds of import
- Sound plays on the first try without reloading the clip

## Notes
From the user feedback report 28 Oct 2026 (ENCA 2); see context.md > Known user issues. Manual only.
