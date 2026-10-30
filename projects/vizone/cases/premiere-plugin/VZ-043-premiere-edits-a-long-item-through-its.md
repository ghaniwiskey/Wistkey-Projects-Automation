---
id: VZ-043
title: "Premiere edits a long item through its proxy and exports full resolution"
feature: premiere-plugin
priority: P2
tags: [regression, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
With the proxy workflow, editors work on light proxies but the export uses the high-res media.

## Preconditions
- Proxy workflow is enabled in the Vizone plugin
- A workstation with Premiere and the Vizone plugin

## Data
- The longest video item (1-2 hours)

## Steps
1. Import the long item through the Vizone panel
2. Check that the clip in Premiere is the proxy (Toggle Proxies on)
3. Place 1 minute of it on a sequence and export with Toggle Proxies off

## Expected
- The clip is usable on the timeline within 10 seconds of import
- The exported file has the high-res frame size (e.g. 1920x1080) and full audio

## Notes
Fix verification for the 28 Oct 2026 feedback report, recommended remediation: implement a proxy workflow (System Performance). See context.md > Known user issues. Manual only.
