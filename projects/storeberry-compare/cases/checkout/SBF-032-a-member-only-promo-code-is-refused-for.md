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

## Notes
Idea from explorations/2026-10-27-promotions-transfers.md.
