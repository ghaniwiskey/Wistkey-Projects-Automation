---
id: Q-003
title: "Which search variants must match: Simplified vs Traditional Chinese, full-width text, excluding words?"
status: open
askedTo: "Ghani"
env: staging
found: 2026-10-30T03:20:57.446Z
foundBy: "edge-case exploration 2026-10-30"
tests: [VZ-019, VZ-020]
bugs: []
updated: 2026-10-30T03:20:57.446Z
answered: ""
---
## Question
On staging: 财政 (Simplified) finds nothing while 財政 finds 22 items; ＴＥＳＴ (full-width) finds nothing while TEST finds 89; -財政 and NOT 財政 return all 196 items instead of excluding. Should these work (bugs), or are they out of scope for Viz One search?

## Context
CNCA/ENCA editors type with Chinese input methods, so Simplified and full-width input are likely. AND works (財政 AND test = 14).

## Answer
Not answered yet.

## History
- 2026-10-30: asked from edge-case exploration 2026-10-30.
- 2026-10-30: VZ-027 (excluding words) archived as outside the feedback scope.
