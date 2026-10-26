---
id: SCRM-060
title: "Reschedule a QA appointment and release its original slot"
feature: appointments
priority: P1
tags: [regression, writes, final]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
Rescheduling a QA appointment updates its time and makes the former slot available.

## Preconditions
- A staging QA appointment and an alternative available slot for the same service/resource exist.
- Notification routing is confirmed safe.

## Data
- Existing QA appointment selected dynamically.
- Alternative available slot selected from current schedule.

## Steps
1. Sign in to the staging CRM and open the QA appointment.
2. Reschedule it to the available alternative slot.
3. Reopen the appointment and review both the new and original slots in the schedule.

## Expected
- The appointment shows the new date/time after reload.
- The former slot is available again when no other booking occupies it.

## Notes
Data-changing final scenario. Staging only. Obtain explicit user approval before each run/retry. Use only QA data; never use real customer/payment details. Use a QA appointment only; rescheduling may notify the contact.
