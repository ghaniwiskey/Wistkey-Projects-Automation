---
id: SCRM-097
title: "Status List Details and Order links open the enrolment and its order"
feature: courses
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Staff can open an enrolment and its order from Courses & Enrolment > Status List.

## Preconditions
- At least one enrolment exists

## Data
- Any enrolment row

## Steps
1. Open Courses & Enrolment > Status List
2. Click Details on a row
3. Go back and click Order on the same row

## Expected
- Details opens the enrolment (session, learner, status)
- Order opens the linked order detail

## Notes
Read-only. Currently fails: BUG-023 (2026-10-27).
