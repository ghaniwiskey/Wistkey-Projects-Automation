---
id: VZ-028
title: "Sort results by media duration and reverse the order"
feature: search
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Editors can find the longest or shortest items by sorting.

## Preconditions
- Items with different durations exist

## Data
- Sort: Media Duration

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the VZ_ADMIN_USER / VZ_ADMIN_PASS account
2. Open Search > Items and choose sort Media Duration
3. Note the first three durations
4. Press Reverse

## Expected
- After sorting, durations go from longest to shortest (03:40:00:00 first on 2026-10-30)
- After Reverse, the first results are the shortest items and the longest is no longer first
