---
id: SCRM-168
title: "Cancelling a Loyalty Product redemption returns the points and stock exactly once"
feature: loyalty
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Undoing a points redemption does not lose or duplicate points.

## Preconditions
- A completed QA loyalty product redemption (SCRM-155)

## Steps
1. Cancel / void / refund the redemption order
2. Repeat the cancel action if it is still offered
3. Read the member points history and the product stock

## Expected
- Points come back once; stock comes back once; the second cancel is not offered or does nothing

## Notes
Critical flow inside a feature first covered on 2026-10-29 (feature-coverage review follow-up). Never tested.
