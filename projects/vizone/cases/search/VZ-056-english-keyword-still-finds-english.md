---
id: VZ-056
title: "English keyword still finds English-titled items after translation is added"
feature: search
priority: P2
tags: [regression, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Adding translation or transcription does not make normal English search worse.

## Preconditions
- Items with English text about Paul Chan exist

## Data
- Keyword: Paul Chan

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the VZ_ADMIN_USER / VZ_ADMIN_PASS account
2. Search Items for Paul Chan
3. Open the first three results

## Expected
- At least 21 results are returned (21 on 2026-10-30)
- Each of the first three results contains Paul Chan in its title or text, or in its transcript/translation

## Notes
Post-fix regression for the 28 Oct 2026 feedback (ENCA 3 remediation side effects). Baseline: manual runs of 2026-10-30.
