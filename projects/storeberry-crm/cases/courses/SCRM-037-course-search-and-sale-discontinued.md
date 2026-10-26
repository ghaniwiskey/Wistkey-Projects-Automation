---
id: SCRM-037
title: "Course search and sale/discontinued views filter the catalog"
feature: courses
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
The course catalog search and status views return matching courses.

## Preconditions
- At least one active course and one course in the selected status view are available.

## Data
- Existing course name, selected dynamically.

## Steps
1. Sign in to the staging CRM and open Courses & Enrolment > Courses Information.
2. Search by the name of an existing course.
3. Review All, On Sales Courses, and Discontinued Course views.

## Expected
- Search results include the selected course and its displayed price, category, and status.
- On Sales Courses and Discontinued Course views contain only courses in the selected view.
- Counts are dynamic.

## Notes
Read-only. Do not add, edit, or discontinue courses.
