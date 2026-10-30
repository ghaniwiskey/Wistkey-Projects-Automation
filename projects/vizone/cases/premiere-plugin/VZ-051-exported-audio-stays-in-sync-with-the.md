---
id: VZ-051
title: "Exported audio stays in sync with the picture over a long sequence"
feature: premiere-plugin
priority: P1
tags: [regression, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
The audio fix does not introduce drift on long exports.

## Preconditions
- A newsroom workstation with Adobe Premiere and the fixed Vizone plugin connected to staging

## Data
- A 1 hour sequence built from a long Vizone program item with visible speech

## Steps
1. Export the 1 hour sequence
2. Play the exported file at the start, at 30 minutes and at the last minute

## Expected
- Lips and sound match at all three points (offset under 1 frame)
- The exported duration equals the sequence duration

## Notes
Post-fix regression for the 28 Oct 2026 feedback (CNCA 3). Baseline: manual runs of 2026-10-30. Manual only.
