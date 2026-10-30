---
id: VZ-041
title: "Searching a spoken word finds the item through its transcript"
feature: transcription
priority: P2
tags: [regression, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Editors find clips by what is said, not only by the title.

## Preconditions
- AI auto-transcription is enabled and at least one item has a transcript

## Data
- Keyword: a word heard in the item's speech that is not in its title, picked at runtime from its subtitles

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the VZ_ADMIN_USER / VZ_ADMIN_PASS account
2. Open the transcribed item, play it and note a spoken word that is not in the title
3. Search Items for that word
4. In the item player, type the word in Search in Subtitles

## Expected
- The item appears in the Search Items results
- Search in Subtitles jumps the player to the moment the word is said

## Notes
Fix verification for the 28 Oct 2026 feedback report, recommended remediation: integrate AI auto-transcription (Search & Metadata). See context.md > Known user issues.
