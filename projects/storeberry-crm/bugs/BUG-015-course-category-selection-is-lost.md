---
id: BUG-015
title: "Course category selection is lost when switching tabs during creation"
severity: major
status: open
env: staging
url: https://www.stagingl10.storeberry.xyz/bookings/services/create
found: 2026-10-27
foundBy: "explorations/2026-10-27-course-flow/README.md"
tests: [SCRM-090]
frequency: always
---

## Summary
The required Category selected in the Info tab is cleared when switching to Session & Timetable. Saving the otherwise completed course form then rejects the submission, blocking course creation through this flow.

## Steps to reproduce
1. Sign in to staging CRM as the configured test account and open Courses & Enrolment > Courses Information > Add New Course.
2. Enter a course name, then enter the existing category `Course` in Category and press Enter; verify the category chip appears.
3. Open Session & Timetable, set one session per purchase, and select an active timetable.
4. Click Save. Repeat from a fresh Add New Course form.

## Expected
- The selected Category remains associated with the course when navigating between tabs, and the valid course form saves.

## Actual
- The Category field is empty after switching tabs. Clicking Save displays `Please select a category!` and the form remains unsaved. Reproduced twice.

## Evidence
- Screenshot: ![course category lost](../explorations/2026-10-27-course-flow/01-course-category-lost.png)
- Console errors:
- Failed requests:

## Environment
- Base URL: https://www.stagingl10.storeberry.xyz
- Browser: Aside browser, CRM staging session.

## History
- 2026-10-27: filed from the staging course creation exploration; reproduced twice.
