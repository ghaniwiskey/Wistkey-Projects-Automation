---
id: VZ-014
title: "Long or archived Vizone clip previews in the Premiere Media Bin without hanging"
feature: premiere-plugin
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
In Adobe Premiere with the Vizone plugin, clicking a long or archived clip thumbnail previews it without freezing Premiere.

## Preconditions
- A newsroom workstation with Adobe Premiere and the Vizone plugin connected to staging
- A 1-2 hour item and an archived (Scality/NAS) item exist

## Data
- Items: the longest video item and one archived item, found in Studio first

## Steps
1. Open Premiere and the Vizone panel, log in to staging
2. Search the long item and click its thumbnail in the Media Bin
3. Drag it to the timeline and play
4. Repeat with the archived item

## Expected
- The preview starts within 5 seconds for each item
- Dragging to the timeline places the clip and playback starts; Premiere does not freeze or crash

## Notes
From the user feedback report 28 Oct 2026 (CNCA 1); see context.md > Known user issues. Manual only (desktop plugin, not reachable from the browser).
