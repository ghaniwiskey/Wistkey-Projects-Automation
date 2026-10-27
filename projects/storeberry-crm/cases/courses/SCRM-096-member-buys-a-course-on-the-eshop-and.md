---
id: SCRM-096
title: "Member buys a course on the eShop and is enrolled after payment is accepted"
feature: courses
priority: P0
tags: [smoke, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
A visible course bought on the eShop with Bank Transfer creates an enrolment on the chosen upcoming session, uses a seat, and gives the seat back on refund or void.

## Preconditions
- A visible (Regular) QA course with a timetable that has an upcoming session with a free seat
- A logged-in QA member

## Data
- QA course and session found at runtime

## Steps
1. Open the course page on the eShop, pick an upcoming date and timeslot, click Apply
2. Check out with Bank Transfer and upload a receipt
3. In the CRM accept the receipt
4. Open Courses & Enrolment > Status List (search the order) and the Enrolment Status day view
5. Refund the order (Original Payment Method) and recheck the enrolment and the day view

## Expected
- The enrolment shows the chosen session, Pending Payment before acceptance and Complete after
- The day view shows the seat taken (e.g. 1 / 1) and the member sees the course under My Courses & Enrolment
- After refund or void the enrolment is Refunded/Canceled and the seat is free again (0 / 1)

## Notes
Bank Transfer only. Verified 2026-10-27 with course 3200 (timetable 70, capacity 1): TXN0126102700021 accepted -> enrolment 389 Complete, 4 Nov 1 / 1; refund -> 0 / 1. The session date was wrong because a past date was picked (storeberry-compare BUG-014).
