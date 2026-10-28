---
id: SCRM-142
title: "Welcome points expire on the date set in the loyalty settings for both CRM-created and eShop sign-ups"
feature: loyalty
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Points expiry follows one rule regardless of where the member signed up.

## Preconditions
- Loyalty settings expiry rule read at runtime

## Data
- One member created in the CRM, one registered on the eShop

## Steps
1. Create both members
2. Read the welcome points and their expiry date on each member

## Expected
- Both get the same welcome points with the expiry from the settings

## Notes
Gap from the 2026-10-29 critical-flow review, second pass (no existing case found by search). Never tested. Related: Q-005 (seen 1 year vs 1 month).
