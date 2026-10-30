---
id: VZ-044
title: "Export queued to Adobe Media Encoder keeps all Vizone audio tracks"
feature: premiere-plugin
priority: P1
tags: [regression, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
The audio pass-through fix between the Vizone plugin and Adobe Media Encoder works.

## Preconditions
- The fixed Vizone plugin version is installed
- A workstation with Premiere and Adobe Media Encoder

## Data
- A sequence with two Vizone clips that each have 2 or more audio tracks

## Steps
1. Build the sequence with all audio tracks enabled (none muted)
2. File > Export > Media > Queue (send to Adobe Media Encoder)
3. Render in Media Encoder and play the result
4. Repeat 5 times with different clips

## Expected
- Every rendered file has sound on all clips, matching the sequence preview
- The audio track count in the file matches the export preset

## Notes
Fix verification for the 28 Oct 2026 feedback report, recommended remediation: fix audio pass-through between Vizone plugin and Adobe Media Encoder (CNCA 3). See context.md > Known user issues. Manual only. VZ-015 covers direct export.
