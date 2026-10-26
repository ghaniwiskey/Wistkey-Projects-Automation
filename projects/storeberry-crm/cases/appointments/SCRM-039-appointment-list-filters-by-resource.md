---
id: SCRM-039
title: "Appointment list filters by resource, service, and date"
feature: appointments
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
A CRM user can narrow appointments by resource, service, and time range.

## Preconditions
- Dedicated Storeberry Flower staging admin account is configured in local .env.

## Data
- A valid date/time range and available resource/service selected from the UI.

## Steps
1. Sign in to the staging CRM and open Appointments > Appointments.
2. Set a valid start and end time and select an available resource.
3. Select an available service and run Search.

## Expected
- Every displayed appointment matches the selected resource, service, and time range.
- The result count reflects the selected criteria and may be zero when no appointment matches.
- Customer name, mobile, email, and member ID are not copied into reports.

## Notes
Read-only. Do not create, reschedule, or cancel appointments; protect customer PII.
