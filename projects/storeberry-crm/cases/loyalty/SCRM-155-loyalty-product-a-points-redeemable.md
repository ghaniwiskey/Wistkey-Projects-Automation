---
id: SCRM-155
title: "Loyalty Product: a points-redeemable product can be set up and redeemed by a member"
feature: loyalty
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Members can exchange points for products as configured.

## Preconditions
- A QA product; a QA member with enough points (SCRM-081)

## Data
- Points price chosen at runtime

## Steps
1. Add the QA product as a loyalty product with a points price
2. Redeem it as the member (eShop or POS, wherever offered)
3. Read points and stock

## Expected
- Points drop by the points price once; stock drops by 1; the redemption is in the member history
- Cleanup: remove it from Loyalty Product and return the points

## Notes
Feature with no cases before the 2026-10-29 feature-coverage review (menu/page found in the live staging app). Never tested.
