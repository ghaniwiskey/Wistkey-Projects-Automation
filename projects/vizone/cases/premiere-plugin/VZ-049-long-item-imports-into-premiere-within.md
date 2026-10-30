---
id: VZ-049
title: "Long item imports into Premiere within the target time during the 3 PM peak"
feature: premiere-plugin
priority: P1
tags: [regression, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Editors can start cutting a long program quickly even at peak.

## Preconditions
- A newsroom workstation with Adobe Premiere and the fixed Vizone plugin connected to staging
- Run once between 10:00 and 12:00 and once between 15:00 and 18:00 HKT

## Data
- The longest video item (1-2 hours)

## Steps
1. Import the item through the Vizone panel and time it until it can be played on the timeline
2. Repeat 3 times per time slot

## Expected
- Each import is playable within 10 seconds (or the Q-001 target)
- The peak median is no more than twice the morning median

## Notes
Post-fix regression for the 28 Oct 2026 feedback (CNCA 2, ENCA 1). Baseline: manual runs of 2026-10-30. Manual only. VZ-012 covers the Studio web player.
