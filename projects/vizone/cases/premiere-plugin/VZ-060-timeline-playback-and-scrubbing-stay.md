---
id: VZ-060
title: "Timeline playback and scrubbing stay smooth during the 3 PM peak"
feature: premiere-plugin
priority: P2
tags: [regression, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Editing (not only search and import) stays usable during the daily peak.

## Preconditions
- A newsroom workstation with Adobe Premiere and the fixed Vizone plugin connected to staging
- Run once between 10:00 and 12:00 and once between 15:00 and 18:00 HKT

## Data
- A sequence with the longest Vizone item on the timeline

## Steps
1. Jump to the start, middle and end of the sequence and press Play at each point
2. Scrub across the whole timeline
3. Play 30 seconds without stopping

## Expected
- Playback starts within 1 second after each jump (or the Q-001 target)
- During the 30 seconds playback never stalls for more than 1 second
- The peak results are no more than twice the morning results

## Notes
Post-fix regression for the 28 Oct 2026 feedback (CNCA 2 "search, loading and editing"). Manual only.
