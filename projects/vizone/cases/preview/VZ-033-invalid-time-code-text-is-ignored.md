---
id: VZ-033
title: "Invalid time code text is ignored"
feature: preview
priority: P3
tags: [regression]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Typing letters or impossible values leaves the player where it was.

## Preconditions
- At least one video item exists

## Data
- Values: abc, 99:99:99:99

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the VZ_ADMIN_USER / VZ_ADMIN_PASS account
2. Open any Online video item
3. Enter abc in the time code
4. Enter 99:99:99:99 in the time code

## Expected
- The time code and picture stay at the previous position after each entry
- No error dialog appears
