---
id: VZ-053
title: "Plugin upgrade keeps existing projects linked to their Vizone media"
feature: premiere-plugin
priority: P1
tags: [regression, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Moving every workstation to the approved plugin does not break projects made with the old one.

## Preconditions
- A Premiere project saved before the upgrade that uses at least 3 Vizone clips
- A workstation upgraded to the approved plugin

## Data
- The pre-upgrade project

## Steps
1. Open the pre-upgrade project on the upgraded workstation
2. Play every Vizone clip in the sequence
3. Export 30 seconds

## Expected
- No clip is shown as Media Offline
- All clips play with sound and the export has sound

## Notes
Post-fix regression for the 28 Oct 2026 feedback (CNCA 5). Baseline: manual runs of 2026-10-30. Manual only.
