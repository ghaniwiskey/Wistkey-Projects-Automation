---
id: VZ-047
title: "Premiere stays stable after importing five long items in a row"
feature: premiere-plugin
priority: P2
tags: [regression, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Repeated long imports no longer freeze or crash Premiere.

## Preconditions
- A newsroom workstation with Adobe Premiere and the fixed Vizone plugin connected to staging
- Five video items of 1 hour or longer exist

## Data
- The five longest video items

## Steps
1. Import the five items one after another through the Vizone panel
2. Place each on the timeline and play 10 seconds of each
3. Scrub through the timeline from start to end

## Expected
- Every import finishes and plays; no "Not responding" window and no crash
- Memory use of Premiere goes back down after the imports (Task Manager)

## Notes
Post-fix regression for the 28 Oct 2026 feedback (CNCA 1, Premiere crash). Baseline: manual runs of 2026-10-30. Manual only.
