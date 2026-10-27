---
id: SBF-021
title: "Course page only lets customers book upcoming sessions and books the chosen one"
feature: courses
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Past session dates cannot be chosen, and the enrolment is on the date the customer picked.

## Preconditions
- A visible QA course with a weekly Fixed timetable
- Logged-in QA member

## Data
- QA course 3200 or another found at runtime

## Steps
1. Open the course page on the eShop
2. Click a past session date in the calendar (shown with is_passed)
3. Pick the timeslot and click Apply
4. Check out (Bank Transfer) and open the enrolment in the CRM Status List

## Expected
- Past dates are disabled, or Apply is refused with a message
- If a date is accepted, the enrolment and cart show that same date

## Notes
Currently fails: BUG-014 (2026-10-27). Void the order afterwards to free the seat.
