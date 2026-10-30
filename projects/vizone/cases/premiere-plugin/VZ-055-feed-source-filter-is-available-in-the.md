---
id: VZ-055
title: "Feed-source filter is available in the Premiere Vizone panel"
feature: premiere-plugin
priority: P2
tags: [regression, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Editors can narrow clips to Live View, agency feeds or press releases without leaving Premiere.

## Preconditions
- A newsroom workstation with Adobe Premiere and the fixed Vizone plugin connected to staging
- Feed-source categorisation is live (VZ-042)

## Data
- Feed sources: Live View, an agency feed, press release

## Steps
1. Open the Vizone panel search
2. Filter by each feed source in turn

## Expected
- Each filter lists only clips from that source
- The counts match the same filter in Studio

## Notes
Post-fix regression for the 28 Oct 2026 feedback (ENCA 3). Baseline: manual runs of 2026-10-30. Manual only.
