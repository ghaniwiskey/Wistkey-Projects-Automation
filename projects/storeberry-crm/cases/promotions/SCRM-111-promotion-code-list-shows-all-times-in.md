---
id: SCRM-111
title: "Promotion code list shows all times in the same local time zone"
feature: promotions
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Staff can read when a code was created, assigned and used.

## Preconditions
- Staging CRM login; a QA promotion "Promo Code: Get Y% off with discount code X", Applied Shop Online Shop, Multiple Promotion Code (created during the test, e.g. 662), one Generated code

## Steps
1. Assign the code to a QA member and note the local time
2. Read Staff Reserved At, Member Reserved At, Created At and Updated At

## Expected
- Staff Reserved At and Member Reserved At equal the local time of the assignment
- Created At / Updated At are local time in the same readable format (no UTC "Z" marker on local times)

## Notes
Currently fails: BUG-026 (2026-10-28): Staff Reserved At 22:11:21 vs Member Reserved At 06:11:21 for the same assignment.
