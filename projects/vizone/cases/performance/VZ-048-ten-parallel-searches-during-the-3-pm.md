---
id: VZ-048
title: "Ten parallel searches during the 3 PM peak stay within the target time"
feature: performance
priority: P2
tags: [regression, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
The upgraded Media Server handles many editors searching at once.

## Preconditions
- Run between 15:00 and 18:00 HKT on a working day

## Data
- 10 keywords that return results (5 English, 5 Chinese)

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the VZ_ADMIN_USER / VZ_ADMIN_PASS account
2. Start the 10 searches at the same time (10 browser sessions or the automated load script)
3. Note each time until the results count appears

## Expected
- All 10 searches show results within 5 seconds (or the target agreed in Q-001)
- No search shows an error or stays on Loading Search Results

## Notes
Post-fix regression for the 28 Oct 2026 feedback (CNCA 2, Media Server load). Baseline: manual runs of 2026-10-30. Read-only; keep the load short so the newsroom is not slowed.
