---
project: storeberry-crm
env: staging
charter: "Explore Storeberry CRM course catalog, timetable availability, and the QA enrollment path"
date: 2026-10-27
timebox: 20m
status: done
---

## Scope
- In scope: Courses Information, timetable list, Enrolment Status calendar, and course setup form structure.
- Out of scope: enrollment submission was not reached because course creation was blocked by a reproducible category-selection defect; production.
- User approved creating QA course/timetable data and one staging enrollment with a synthetic learner. The timetable was created; the course and enrollment were not.

## Coverage notes
- Courses Information loaded at `/bookings/services` with 29 courses, 7 On Sales Courses, and 24 Discontinued Course entries. Search and status filters were not exercised; SCRM-037 is partial and not recorded as a completed manual case.
- Timetable page displayed 54 active and 12 terminated timetables, including types Fixed and Free pick. Selected timetable English Class (ID 69) in day view for 27 Oct 2026; no session entries appeared. Selected PickleBall (Busy) (ID 61) for 27 and 28 Oct 2026; no session entries appeared on those dates.
- The calendar legend includes Free, Have Vacancies, Full, and No sessions, but no date with a session was found in the limited checks. Did not test those states or submit enrollment. SCRM-038 is partial and not recorded as a completed manual case.
- Created an isolated active QA timetable, ID 70 (`QA Course Flow 2026-10-27`), Fixed, capacity 1, with a Wednesday 14:00–15:00 slot. It is not linked to any course and is retained for this exploration.
- Created a draft QA course form with a hidden product, existing `Course` category, one session per purchase, and timetable ID 70. The category chip appeared after Enter, but disappeared after switching from Info to Session & Timetable. Save failed twice with `Please select a category!`; the course was not saved. Filed BUG-015 and added SCRM-090.
- No enrollment or notification was triggered. Course list search and storefront visibility were not reached. SCRM-090 failed in manual run `2026-10-27_1220_staging_manual`; SCRM-037 and SCRM-038 were partial and excluded.

## Findings
| # | Type | Summary | Severity | Link |
|---|---|---|---|---|
| 1 | bug | Required course category is cleared when switching tabs; save rejects the course with `Please select a category!`. Reproduced twice. | major | BUG-015 / SCRM-090 |

## New test ideas
- [ ] Complete an enrollment with a QA learner on a session confirmed to have vacancies; verify enrollment status and remaining capacity (SCRM-063, P0, smoke, writes, final; requires per-run approval and safe notification routing).
- [ ] Exercise full-session rejection without consuming or changing a shared seat (SCRM-064, P1, regression, writes, final; requires a dedicated full QA session).
- [ ] Extend timetable coverage to a date with sessions and assert Free / Have Vacancies / Full states, plus a date with no sessions.

## Knowledge updates
- CRM routes observed: Courses Information `/bookings/services`; Enrolment Status `/bookings?timetable_id=<id>&mode=year|day&year=<year>&date=<YYYY-MM-DD>`; Timetable is available under Courses & Enrolment.
- SCRM-090 covers category persistence across course form tabs. Evidence screenshot: `01-course-category-lost.png`.
- QA timetable ID 70 remains active and unlinked to a course; remove it after a successful retest if no longer needed.
