---
id: VZ-050
title: "Export of clips with different audio layouts keeps all audio"
feature: premiere-plugin
priority: P1
tags: [regression, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
The audio fix works for mono, stereo and multi-track Vizone clips mixed in one sequence.

## Preconditions
- A newsroom workstation with Adobe Premiere and the fixed Vizone plugin connected to staging

## Data
- Three Vizone clips: one mono, one stereo, one with 4 or more audio tracks (check Files tab Audio LR count in Studio)

## Steps
1. Put the three clips in one sequence
2. Export directly and also via Adobe Media Encoder
3. Play both exported files

## Expected
- Both files have sound for all three clips
- No clip is silent and no channel is missing compared with the sequence preview

## Notes
Post-fix regression for the 28 Oct 2026 feedback (CNCA 3, ENCA 2). Baseline: manual runs of 2026-10-30. Manual only.
