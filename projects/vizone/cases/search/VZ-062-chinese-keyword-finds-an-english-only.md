---
id: VZ-062
title: "Chinese keyword finds an English-only item"
feature: search
priority: P3
tags: [regression, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
With multilingual translation, CNCA editors searching in Chinese find English-only clips (e.g. agency feeds).

## Preconditions
- Multilingual translation is live (Q-002)
- An item whose title and text are English only exists

## Data
- Item: an English-only item with a clear phrase (e.g. Financial Secretary), found at runtime
- Keyword: the Chinese for that phrase (e.g. 財政司司長)

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the VZ_ADMIN_USER / VZ_ADMIN_PASS account
2. Open the English-only item and note its key phrase
3. Search Items for the Chinese equivalent

## Expected
- The English-only item is in the results

## Notes
Post-fix regression for the 28 Oct 2026 feedback (multilingual translation remediation). Reverse direction of VZ-009.
