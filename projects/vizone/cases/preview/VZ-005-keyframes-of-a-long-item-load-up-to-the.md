---
id: VZ-005
title: "Keyframes of a long item load up to the last page"
feature: preview
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Thumbnails (keyframes) are available across the whole length of a long item.

## Preconditions
- At least one video item of 1 hour or longer exists

## Data
- Item: the longest Online video item, found at runtime

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the VZ_ADMIN_USER / VZ_ADMIN_PASS account
2. Open the longest video item (Search > Items sorted by Media Duration)
3. Open the Keyframes tab
4. Open the last keyframes page

## Expected
- The first page shows keyframe thumbnails starting at 00:00:00:00
- The last page shows thumbnails with time codes close to the item Duration
- Every thumbnail on both pages shows an image (no broken image icons)

## Notes
From the user feedback report 28 Oct 2026 (CNCA 1 thumbnails in the Media Bin); see context.md > Known user issues. A 2h15m item had 34 keyframe pages on 2026-10-30.
