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
- Out of scope: submitting enrollment because no available session was identified in the dates checked; modifying/deleting existing courses or timetables; production.
- User approved one staging enrollment for a synthetic QA learner. No enrollment was submitted.

## Coverage notes
- Courses Information loaded at `/bookings/services` with 29 courses, 7 On Sales Courses, and 24 Discontinued Course entries. Search and status filters were not exercised; SCRM-037 is partial and not recorded as a completed manual case.
- Timetable page displayed 54 active and 12 terminated timetables, including types Fixed and Free pick. Selected timetable English Class (ID 69) in day view for 27 Oct 2026; no session entries appeared. Selected PickleBall (Busy) (ID 61) for 27 and 28 Oct 2026; no session entries appeared on those dates.
- The calendar legend includes Free, Have Vacancies, Full, and No sessions, but no date with a session was found in the limited checks. Did not test those states or submit enrollment. SCRM-038 is partial and not recorded as a completed manual case.
- Inspected Add New Course form tabs. Session & Timetable requires “No. of session(s) per purchase” and a timetable selection. No fields were changed and no course/timetable was saved.
- No customer, course, timetable, enrollment, or notification records were created or modified. No bug confirmed; session/date availability needs a targeted follow-up.

## Findings
| # | Type | Summary | Severity | Link |
|---|---|---|---|---|
| 1 | risk | Enrollment submit path remains untested: active timetables were available in the selector, but no sessions appeared for the dates checked. | - | - |

## New test ideas
- [ ] Complete an enrollment with a QA learner on a session confirmed to have vacancies; verify enrollment status and remaining capacity (SCRM-063, P0, smoke, writes, final; requires per-run approval and safe notification routing).
- [ ] Exercise full-session rejection without consuming or changing a shared seat (SCRM-064, P1, regression, writes, final; requires a dedicated full QA session).
- [ ] Extend timetable coverage to a date with sessions and assert Free / Have Vacancies / Full states, plus a date with no sessions.

## Knowledge updates
- CRM routes observed: Courses Information `/bookings/services`; Enrolment Status `/bookings?timetable_id=<id>&mode=year|day&year=<year>&date=<YYYY-MM-DD>`; Timetable is available under Courses & Enrolment.
- No course or timetable writes performed. No screenshots attached because no defect was confirmed.
