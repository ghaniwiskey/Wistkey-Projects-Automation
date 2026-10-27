---
id: SCRM-063
title: "Enroll a QA learner in an available course session"
feature: courses
priority: P0
tags: [smoke, writes, final]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-27
---

## Goal
A QA learner can enroll in an available course session and receives a confirmed enrollment.

## Preconditions
- An active staging course timetable has an available session and notification routing is confirmed safe.

## Data
- QA learner contact details only.
- Course and available session selected dynamically.

## Steps
1. Sign in to the staging CRM and open course enrolment.
2. Select a course session with available seats.
3. Enter QA-only learner details and submit the enrolment.
4. Open the enrollment record and timetable.

## Expected
- The enrollment is linked to the selected learner, course, and session.
- The enrollment status is confirmed and session availability reflects the new enrollment.
- No message reaches a real person.

## Notes
Data-changing final scenario. Staging only. Obtain explicit user approval before each run/retry. Use only QA data; never use real customer/payment details. Enrollment consumes a limited seat and may trigger notifications.

How (verified 2026-10-27): enrolments are created by selling the course. Hidden courses are not reachable on the eShop, so sell it in Web POS (select the member first, then the course, Cash). The session is assigned automatically from the course timetable; the timetable needs capacity > 0 (English Class has 0 and is refused). Check Courses & Enrolment > Status List (search the order number) and Enrolment Status day view (booked / capacity).
