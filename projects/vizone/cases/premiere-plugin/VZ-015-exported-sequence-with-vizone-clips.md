---
id: VZ-015
title: "Exported sequence with Vizone clips keeps all audio"
feature: premiere-plugin
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Exporting a sequence that uses Vizone clips produces a file with the same audio as the preview.

## Preconditions
- A workstation with Premiere, the Vizone plugin and Adobe Media Encoder

## Data
- Two Vizone video clips with audio; export preset H.264

## Steps
1. Import the two clips via the Vizone panel and place them in a new sequence
2. Play the sequence and confirm the sound
3. Export the sequence (no tracks muted)
4. Play the exported file

## Expected
- The exported file has sound on every clip, the same as the sequence preview
- No audio track has to be muted to get sound

## Notes
From the user feedback report 28 Oct 2026 (CNCA 3); see context.md > Known user issues. Repeat 5 times: the loss is random. Manual only.
