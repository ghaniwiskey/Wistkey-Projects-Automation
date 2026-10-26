---
id: SCRM-061
title: "Cancel a QA appointment and release its reserved slot"
feature: appointments
priority: P1
tags: [regression, writes, final]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
Canceling a QA appointment changes its state and returns its slot to availability.

## Preconditions
- A staging QA appointment exists and notification routing is confirmed safe.

## Data
- Existing QA appointment selected dynamically.

## Steps
1. Sign in to the staging CRM and open the QA appointment.
2. Cancel the appointment using the available cancellation flow.
3. Reopen the appointment and inspect its schedule slot.

## Expected
- The appointment shows Canceled after reload.
- Its former slot is available if no other appointment occupies it.

## Notes
Data-changing final scenario. Staging only. Obtain explicit user approval before each run/retry. Use only QA data; never use real customer/payment details. Use a QA appointment only; cancellation may notify the contact.
