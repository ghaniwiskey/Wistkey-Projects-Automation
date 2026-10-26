---
id: SCRM-064
title: "Reject enrollment when a course session is full"
feature: courses
priority: P1
tags: [regression, writes, final]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
A full course session does not accept an additional QA learner.

## Preconditions
- A staging course session is displayed as Full and notification routing is confirmed safe.

## Data
- Full session selected dynamically.
- QA learner contact details only.

## Steps
1. Sign in to the staging CRM and open course enrolment.
2. Select a session displayed as Full.
3. Attempt to enroll a QA learner.
4. Review the session availability and enrollment list.

## Expected
- The form prevents enrollment or displays a full-capacity message.
- No enrollment is created and the session remains Full.

## Notes
Data-changing final scenario. Staging only. Obtain explicit user approval before each run/retry. Use only QA data; never use real customer/payment details. Do not consume or alter a shared course seat.
