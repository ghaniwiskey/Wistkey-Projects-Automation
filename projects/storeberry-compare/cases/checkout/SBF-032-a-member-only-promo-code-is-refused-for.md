---
id: SBF-032
title: "A member-only promo code is refused for guests and for members below the allowed level"
feature: checkout
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Level-restricted codes reach only the intended members.

## Preconditions
- A QA code promotion with "Member only" and only a level the QA member does not have (e.g. Level 5) ticked, created in the CRM during the test

## Steps
1. As a guest apply the code at /checkout
2. As the QA member (lower level) apply it
3. Tick the member's level in the promotion and apply again as the member

## Expected
- Steps 1 and 2: refused, no discount
- Step 3: applied with the promotion discount
- Cleanup: delete the QA promotion

$12026-10-28 partial run (not recorded: guest step not run because logging out would lose the QA member session): Level-5-only code QALVL1028 (promotion 663, deleted after) refused for the Level 1 member with "Current shopping cart does not meet the promotion code conditions"; after ticking Level 1 it applied (-HKD 15). The refusal message does not say the code is for other member levels.
Idea from explorations/2026-10-27-promotions-transfers.md.
