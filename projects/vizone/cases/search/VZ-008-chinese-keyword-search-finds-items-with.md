---
id: VZ-008
title: "Chinese keyword search finds items with Chinese titles"
feature: search
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Editors can find items by a Chinese word in the title.

## Preconditions
- At least one item with Chinese characters in its title exists

## Data
- Keyword: two Chinese characters taken from the title of an existing item at runtime (e.g. 財政 from 財政司司長陳茂波宣讀財政預算案)

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the VZ_ADMIN_USER / VZ_ADMIN_PASS account
2. Type the keyword in the Search Items box and press Enter

## Expected
- The results count is 1 or more
- The item the keyword was taken from is in the results
- Each result contains the keyword in its title or text

## Notes
From the user feedback report 28 Oct 2026 (ENCA 3); see context.md > Known user issues.
