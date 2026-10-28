---
id: SCRM-148
title: "Overview dashboard figures match the orders and sales for the same period"
feature: overview
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Owners can trust the numbers on the first screen.

## Preconditions
- Logged in to the CRM

## Data
- Period: today and last 7 days

## Steps
1. Open Overview and note sales, order count and other figures for the period
2. Compare with Reports > Sales and the order list for the same period

## Expected
- Figures match the report and the paid orders (or the difference is explained by the label)
- The page loads without errors (it rendered blank in a quick check on 2026-10-29)

## Notes
Feature with no cases before the 2026-10-29 feature-coverage review (menu/page found in the live staging app). Never tested.
