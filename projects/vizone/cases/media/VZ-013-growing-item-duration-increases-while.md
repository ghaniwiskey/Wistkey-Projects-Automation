---
id: VZ-013
title: "Growing item duration increases while it is still recording"
feature: media
priority: P2
tags: [regression, writes, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
A live recording shows a growing duration in Studio and can be previewed up to near the live point.

## Preconditions
- A live ingest (recording) is running into Viz One; needs the user's approval and an ingest operator

## Data
- Item: the recording item with Asset media status Importing

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the VZ_ADMIN_USER / VZ_ADMIN_PASS account
2. Open Search > Items, open the Asset media status facet and select Importing
3. Open the recording item and note its Duration
4. Wait 2 minutes and reload the item
5. Drag the Timeline slider to the end and press Play/Pause

## Expected
- The Duration after reload is about 2 minutes longer than before
- Playback near the end shows recent material (time code close to the new end)

## Notes
From the user feedback report 28 Oct 2026 (CNCA 4); see context.md > Known user issues. Starting a recording creates a real item: ask before every run (README > Testing permissions). On 2026-10-30 the Importing items were stale .wav.filepart uploads, not recordings.
