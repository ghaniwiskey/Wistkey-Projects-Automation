---
id: VZ-026
title: "Wildcard search matches title prefixes"
feature: search
priority: P3
tags: [regression]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
A trailing * finds every item whose words start with the typed text.

## Preconditions
- Items with titles starting with test (e.g. test221029...) exist

## Data
- Keywords: test, test*, *

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the VZ_ADMIN_USER / VZ_ADMIN_PASS account
2. Search Items for test and note the count
3. Search Items for test*
4. Search Items for *

## Expected
- test* returns more results than test (138 vs 89 on 2026-10-30), including titles like test221029 bb1port 01 v001
- returns every item (same count as the unfiltered Items list)
