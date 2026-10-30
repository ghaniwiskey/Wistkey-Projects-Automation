---
id: VZ-021
title: "Search ignores letter case"
feature: search
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Upper, lower and mixed case keywords return the same items.

## Preconditions
- Items with "test" in the title exist

## Data
- Keywords: test, Test, TEST

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the VZ_ADMIN_USER / VZ_ADMIN_PASS account
2. Search Items for test and note the results count
3. Search Items for Test
4. Search Items for TEST

## Expected
- All three searches show the same results count (89 on 2026-10-30)
