---
id: VZ-014
title: "Long Vizone clip previews in the Premiere Media Bin without hanging"
feature: premiere-plugin
priority: P1
tags: [regression, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
In Adobe Premiere with the Vizone plugin, clicking the thumbnail of a 1-2 hour clip previews it without freezing Premiere.

## Preconditions
- A newsroom workstation with Adobe Premiere and the Vizone plugin connected to staging
- A 1-2 hour video item exists

## Data
- Item: the longest video item, found in Studio first

## Steps
1. Open Premiere and the Vizone panel, log in to staging
2. Search the long item and click its thumbnail in the Media Bin
3. Drag it to the timeline and play

## Expected
- The preview starts within 5 seconds
- Dragging to the timeline places the clip and playback starts; Premiere does not freeze or crash

## Notes
From the user feedback report 28 Oct 2026 (CNCA 1); see context.md > Known user issues. Manual only (desktop plugin, not reachable from the browser). Archived clips: VZ-046.