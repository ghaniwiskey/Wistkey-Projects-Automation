---
id: VZ-019
title: "Simplified Chinese keyword finds an item with a Traditional Chinese title"
feature: search
priority: P2
tags: [regression, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Editors typing Simplified Chinese still find items titled in Traditional Chinese.

## Preconditions
- An item with a Traditional Chinese title exists, e.g. one containing 財政

## Data
- Keyword: 财政 (Simplified form of 財政)

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the admin test account (user name admin; get the password from the QA lead)
2. Search Items for 財政 and note the results count
3. Search Items for 财政

## Expected
- The 财政 search returns the same results count as 財政

## Notes
Edge case of ENCA 3 / CNCA search. On 2026-10-30 財政 gave 22 results and 财政 gave "No search results found". Expected behavior is Q-003.
