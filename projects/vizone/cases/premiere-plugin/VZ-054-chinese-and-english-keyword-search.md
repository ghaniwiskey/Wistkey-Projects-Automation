---
id: VZ-054
title: "Chinese and English keyword search works in the Premiere Vizone panel"
feature: premiere-plugin
priority: P1
tags: [regression, feedback-fix]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Editors get the same search results in the panel they actually use as in Studio.

## Preconditions
- A newsroom workstation with Adobe Premiere and the fixed Vizone plugin connected to staging

## Data
- Keywords: 財政, 财政, budget, Paul Chan

## Steps
1. Search each keyword in the Vizone panel in Premiere
2. Search the same keywords in Studio Search Items

## Expected
- Each keyword returns the same item count in the panel as in Studio
- 財政 and budget both list the budget speech item 20230222_財政司司長陳茂波宣讀財政預算案 once cross-language search is live (Q-002)

## Notes
Post-fix regression for the 28 Oct 2026 feedback (ENCA 3). Baseline: manual runs of 2026-10-30. Manual only. Studio baseline 2026-10-30: 財政 22, 财政 0, budget 0, Paul Chan 21.
