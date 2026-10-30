---
id: VZ-034
title: "Five long items play at the same time during the 3 PM peak"
feature: preview
priority: P2
tags: [regression, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Several editors can preview long items at once during the daily peak without any player stalling.

## Preconditions
- Run between 15:00 and 18:00 HKT, and once between 10:00 and 12:00 for comparison
- At least five video items of 1 hour or longer exist

## Data
- Items: the five longest Online video items

## Steps
1. Log in to Viz One Studio in five separate browser sessions (or the automated load script) with domain Internal accounts and the VZ_ADMIN_USER / VZ_ADMIN_PASS account
2. Open a different long item in each session
3. Press Play in all five
4. Watch all five for 30 seconds

## Expected
- All five time codes keep advancing for the full 30 seconds
- No player shows a spinner for more than 2 seconds

## Notes
CNCA 2 (concurrent users overload the Media Server). Read-only; keep the load short so the newsroom is not slowed.