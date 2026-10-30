---
id: VZ-064
title: "A deliberately muted track stays silent in the export"
feature: premiere-plugin
priority: P2
tags: [regression, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
The audio pass-through fix still respects tracks the editor mutes on purpose.

## Preconditions
- A newsroom workstation with Adobe Premiere and the fixed Vizone plugin connected to staging

## Data
- A sequence with two Vizone clips: speech on A1, music on A2

## Steps
1. Mute track A2
2. Export directly and via Adobe Media Encoder
3. Play both files
4. Unmute A2 and export again

## Expected
- With A2 muted, both files have the speech and no music
- After unmuting, the new export has both speech and music

## Notes
Post-fix regression for the 28 Oct 2026 feedback (CNCA 3: the workaround was muting a track, so the fix must not break intentional muting). Manual only.
