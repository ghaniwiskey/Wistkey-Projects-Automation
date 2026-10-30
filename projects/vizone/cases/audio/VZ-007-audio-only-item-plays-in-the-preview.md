---
id: VZ-007
title: "Audio-only item plays in the preview player"
feature: audio
priority: P2
tags: [regression, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
An audio item (e.g. a WAV dubbing) can be played in Studio.

## Preconditions
- At least one item with Asset media type Audio exists

## Data
- Item: the first Online audio item (Asset media type facet = Audio), found at runtime

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the VZ_ADMIN_USER / VZ_ADMIN_PASS account
2. Open Search > Items, open the Asset media type facet and select Audio
3. Open the first result
4. Press Play/Pause and listen for 10 seconds

## Expected
- The player shows the item duration from the Overview (e.g. 00:01:42:23)
- Sound is heard and the time code advances

## Notes
From the user feedback report 28 Oct 2026 (ENCA 2); see context.md > Known user issues.
