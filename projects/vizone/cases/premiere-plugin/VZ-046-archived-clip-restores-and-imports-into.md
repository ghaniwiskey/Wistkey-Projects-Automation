---
id: VZ-046
title: "Archived clip restores and imports into Premiere"
feature: premiere-plugin
priority: P1
tags: [regression, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Dragging an archived (Scality/NAS) item into Premiere brings back its media instead of hanging.

## Preconditions
- A newsroom workstation with Adobe Premiere and the fixed Vizone plugin connected to staging
- An item whose high-res file is only in the archive exists (Files tab shows only the archive location)

## Data
- Item: an archive-only video item, found in Studio first

## Steps
1. Search the archived item in the Vizone panel
2. Drag it into the project and onto the timeline
3. Wait for the restore and play the clip

## Expected
- Premiere shows restore progress and stays responsive while it runs
- When the restore ends the clip plays with picture and sound
- In Studio the item's Files tab now also lists an online high-res copy

## Notes
Post-fix regression for the 28 Oct 2026 feedback (CNCA 1, archived files). Baseline: manual runs of 2026-10-30.
