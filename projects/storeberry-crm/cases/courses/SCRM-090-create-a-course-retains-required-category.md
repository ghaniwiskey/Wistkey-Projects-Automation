---
id: SCRM-090
title: "Course creation retains the required category across tabs"
feature: courses
priority: P0
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
A course can be created with a selected category and timetable.

## Preconditions
- A category and active timetable are available.

## Data
- Course name, slug, and SKU: `<unique>`.
- QA-only course details and a QA timetable.

## Steps
1. Sign in to the staging CRM and open Courses & Enrolment > Courses Information > Add New Course.
2. Enter a unique course name and slug, select an existing category, and set the product type to Hidden Product.
3. Open Session & Timetable, set one session per purchase, and select an active timetable.
4. Save the course.
5. Search the course list for the unique course name.

## Expected
- The category remains selected when switching tabs.
- The course saves successfully and appears in the course list with the selected category and timetable.
- The Hidden Product is not visible in the online store catalog.

## Notes
Data-changing staging test. Use unique QA data and delete only the course created by this test after verification. Linked bug: BUG-015.
