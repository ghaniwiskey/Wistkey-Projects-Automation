---
id: VZ-052
title: "Finished recording gets its final length in Premiere and plays to the end"
feature: premiere-plugin
priority: P2
tags: [regression, writes, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
After a live recording stops, the clip already on the timeline ends at the real end of the recording.

## Preconditions
- A newsroom workstation with Adobe Premiere and the fixed Vizone plugin connected to staging
- A live ingest can be started and stopped on staging (approval needed per run)

## Data
- A 10 minute test recording

## Steps
1. Start the recording and drag it onto the timeline after 2 minutes
2. Stop the recording at 10 minutes
3. Extend the clip end in Premiere and play the last 30 seconds

## Expected
- The clip can be extended to the full 10 minutes
- The last 30 seconds play with picture and sound
- In Studio the item status is Online and its Duration is about 00:10:00:00

## Notes
Post-fix regression for the 28 Oct 2026 feedback (CNCA 4). Baseline: manual runs of 2026-10-30. Creates a real item: ask before every run. VZ-017 covers extending while recording.
