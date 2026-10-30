---
id: VZ-011
title: "Search responds within the target time during the 3 PM peak"
feature: performance
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Search stays fast during the daily peak from 15:00 Hong Kong time.

## Preconditions
- Run once between 10:00 and 12:00 and once between 15:00 and 18:00 HKT on the same working day

## Data
- Keywords: one English word and one Chinese word that each return results

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the VZ_ADMIN_USER / VZ_ADMIN_PASS account
2. Search Items for the English keyword and note the time until the results count appears
3. Search Items for the Chinese keyword and note the time
4. Repeat both searches 3 times

## Expected
- Every search shows its results within 5 seconds
- The peak-hour median is no more than twice the morning median

## Notes
From the user feedback report 28 Oct 2026 (CNCA 2); see context.md > Known user issues. Targets are proposals until Q-001 is answered. Record the times in the run note.
