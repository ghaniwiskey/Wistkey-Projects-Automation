---
id: VZ-017
title: "Growing file on the Premiere timeline extends its end timecode"
feature: premiere-plugin
priority: P2
tags: [regression, writes, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
A live recording placed on the timeline keeps extending as it records.

## Preconditions
- A live ingest is running (approval needed, see VZ-013)
- A workstation with Premiere and the Vizone plugin

## Data
- The recording item with Asset media status Importing

## Steps
1. Drag the recording item onto the timeline
2. Wait 5 minutes
3. Refresh / extend the clip end (automatically or by trimming)

## Expected
- The clip end timecode extends to the current recording length
- It keeps working after 10 minutes without restarting Premiere or switching workstation

## Notes
From the user feedback report 28 Oct 2026 (CNCA 4); see context.md > Known user issues. Manual only.
