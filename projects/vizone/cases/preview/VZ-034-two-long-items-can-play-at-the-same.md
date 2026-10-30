---
id: VZ-034
title: "Two long items can play at the same time in two tabs"
feature: preview
priority: P2
tags: [regression, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Several editors (or one editor with two tabs) can preview long items at once without one stalling.

## Preconditions
- At least two video items of 1 hour or longer exist

## Data
- Items: the two longest Online video items

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the VZ_ADMIN_USER / VZ_ADMIN_PASS account
2. Open the longest item in tab 1 and the second longest in tab 2
3. Press Play in both tabs
4. Watch both for 30 seconds

## Expected
- Both time codes keep advancing for the full 30 seconds
- Neither player shows a spinner for more than 2 seconds

## Notes
Load edge case of CNCA 2 (concurrent users). Run at peak and off-peak.
