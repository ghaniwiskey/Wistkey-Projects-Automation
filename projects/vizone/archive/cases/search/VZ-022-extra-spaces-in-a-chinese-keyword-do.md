---
id: VZ-022
title: "Extra spaces in a Chinese keyword do not change the results"
feature: search
priority: P3
tags: [regression]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Leading, trailing and inner spaces typed by mistake do not break a Chinese search.

## Preconditions
- An item with 財政 in its title exists

## Data
- Keywords: 財政, "  財政", "財政 ", "財 政"

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the VZ_ADMIN_USER / VZ_ADMIN_PASS account
2. Search Items for 財政 and note the results count
3. Search Items for each variant with spaces

## Expected
- Every variant returns the same results count as 財政
