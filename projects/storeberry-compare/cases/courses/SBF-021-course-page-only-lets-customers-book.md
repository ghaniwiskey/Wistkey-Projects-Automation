---
id: SBF-021
title: "Course page only lets customers book upcoming sessions and books the chosen one"
feature: courses
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-28
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
Click the dates like a customer (real pointer click). Past dates have CSS `pointer-events: none`; a DOM `element.click()` or a forced click bypasses that and reaches the booking (the server then books the next session), which a customer cannot do.
2026-10-28 manual: pass (7/14/21 Oct do nothing, "Please select a date"). The 2026-10-27 fail and BUG-014 were an automation artifact (DOM click); BUG-014 withdrawn. If a booking is placed, void the order afterwards to free the seat.
