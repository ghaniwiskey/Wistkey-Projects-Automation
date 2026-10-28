---
id: SCRM-146
title: "Member level drops at the end of the level period when the spending is not kept"
feature: loyalty
priority: P2
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Level downgrade follows the loyalty settings.

## Preconditions
- Loyalty level period and retention rule read at runtime (Level 3 $2000, Level 4 $3000, Level 5 $5000, carryover)

## Data
- A QA member whose level period end can be observed (or settings that show the rule)

## Steps
1. Read the member level, period end and spending
2. After the period end (or with the shortest period configurable), read them again

## Expected
- The level and discount drop per the rule; spending resets per the rule

## Notes
Gap from the 2026-10-29 critical-flow review, third pass (no existing case found by search). Never tested. Long-running: may need a member created with a short period. SCRM-119 covers upgrades.
