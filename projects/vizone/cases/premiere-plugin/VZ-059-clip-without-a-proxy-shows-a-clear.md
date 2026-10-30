---
id: VZ-059
title: "Clip without a proxy shows a clear message in the Premiere Vizone panel"
feature: premiere-plugin
priority: P2
tags: [regression, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Clicking a clip whose proxy is missing tells the editor why instead of hanging.

## Preconditions
- A newsroom workstation with Adobe Premiere and the fixed Vizone plugin connected to staging
- A video item with Asset media status Failed and no proxy exists (see VZ-029)

## Data
- Item: the first Failed video item, found in Studio first

## Steps
1. Search the item in the Vizone panel
2. Click its thumbnail in the Media Bin
3. Drag it to the timeline

## Expected
- Within 5 seconds the panel shows a message that the preview is not available (e.g. missing proxy)
- Premiere stays responsive and no frozen or empty preview window is left open

## Notes
Post-fix regression for the 28 Oct 2026 feedback (CNCA 1 "no response"). Studio counterpart: VZ-029. Manual only.
