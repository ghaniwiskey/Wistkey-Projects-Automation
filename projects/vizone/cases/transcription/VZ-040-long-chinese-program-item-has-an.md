---
id: VZ-040
title: "Long Chinese program item has an automatic transcript shown as subtitles"
feature: transcription
priority: P2
tags: [regression, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
After AI auto-transcription is enabled, an item's speech is available as subtitles in the Studio player.

## Preconditions
- AI auto-transcription has been switched on for staging (ask RTHK IT)
- A Cantonese or Mandarin program item ingested after it was switched on exists

## Data
- Item: a spoken-word item ingested after transcription was enabled, found at runtime

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the VZ_ADMIN_USER / VZ_ADMIN_PASS account
2. Open the item
3. Press Toggle subtitles in the player and press Play

## Expected
- Toggle subtitles and Search in Subtitles are enabled (both were disabled on 2026-10-30)
- Subtitles appear and follow the speech within about 1 second

## Notes
Fix verification for the 28 Oct 2026 feedback report, recommended remediation: integrate AI auto-transcription (Search & Metadata). See context.md > Known user issues.
