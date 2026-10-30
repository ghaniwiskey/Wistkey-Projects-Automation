---
id: VZ-027
title: "Excluding a keyword removes the matching items"
feature: search
priority: P3
tags: [regression]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Editors can exclude a word (NOT or minus) to narrow results.

## Preconditions
- An item with 財政 in its title exists

## Data
- Keywords: 財政, -財政, NOT 財政

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the VZ_ADMIN_USER / VZ_ADMIN_PASS account
2. Open Search > Items and note the total count
3. Search Items for 財政 and note the count
4. Search Items for -財政
5. Search Items for NOT 財政

## Expected
- -財政 and NOT 財政 return the total count minus the 財政 count
- No result contains 財政 in its title

## Notes
On 2026-10-30 both returned all 196 items (total, not 174), while 財政 AND test worked (14). Whether exclusion is supported is Q-003.
