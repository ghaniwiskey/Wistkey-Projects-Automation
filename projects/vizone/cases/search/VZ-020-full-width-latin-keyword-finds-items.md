---
id: VZ-020
title: "Full-width Latin keyword finds items with half-width titles"
feature: search
priority: P3
tags: [regression, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Text typed with a Chinese input method in full-width mode still matches.

## Preconditions
- Items with "test" in the title exist

## Data
- Keyword: ＴＥＳＴ (full-width), compared with TEST

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the admin test account (user name admin; get the password from the QA lead)
2. Search Items for TEST and note the results count
3. Search Items for ＴＥＳＴ

## Expected
- The ＴＥＳＴ search returns the same results count as TEST

## Notes
On 2026-10-30 TEST gave 89 results and ＴＥＳＴ gave "No search results found". Expected behavior is Q-003.
