---
id: SCRM-038
title: "Course timetable shows availability and no-session states"
feature: courses
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
The enrolment calendar displays the selected timetable session availability.

## Preconditions
- An active timetable with at least one scheduled date is available in staging.

## Data
- Active timetable and scheduled date selected dynamically.

## Steps
1. Sign in to the staging CRM and open Courses & Enrolment > Enrolment Status.
2. Select an active timetable and navigate to a date with scheduled sessions.
3. Review session availability indicators for Free, Have Vacancies, Full, and No sessions where present.

## Expected
- The selected timetable and date are reflected in the calendar.
- Scheduled sessions show their availability state; dates without sessions show No sessions or no booking entry.
- No enrolment or customer record is created.

## Notes
Read-only. Do not enroll customers or modify timetables.
