---
id: SCRM-162
title: "Clock In/Out records staff attendance per store and exports it"
feature: pos
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Store attendance is recorded correctly.

## Preconditions
- Find how staff clock in (POS or app) at runtime

## Steps
1. Clock in and out as the staff account at a store
2. Open Clock In/Out, filter by store and date, Export

## Expected
- The record shows the right store, local times and duration; the export matches

## Notes
Feature with no cases before the 2026-10-29 feature-coverage review (menu/page found in the live staging app). Never tested.
