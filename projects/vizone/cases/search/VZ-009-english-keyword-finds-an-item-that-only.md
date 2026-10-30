---
id: VZ-009
title: "English keyword finds an item that only has a Chinese title"
feature: search
priority: P2
tags: [regression, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
An English search finds the matching item whose title and metadata are only in Chinese.

## Preconditions
- An item exists whose title is only Chinese, e.g. 財政司司長陳茂波宣讀財政預算案 (budget speech)

## Data
- Keyword: budget (English for 財政預算案)

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the admin test account (user name admin; get the password from the QA lead)
2. Type budget in the Search Items box and press Enter

## Expected
- The results include the item titled ...財政司司長陳茂波宣讀財政預算案...

## Notes
From the user feedback report 28 Oct 2026 (ENCA 3); see context.md > Known user issues. On 2026-10-30 "budget" returned "No search results found" while 財政預算案 found the item. Whether this is a bug or a future feature (AI transcription / translation in the report) is Q-002.
