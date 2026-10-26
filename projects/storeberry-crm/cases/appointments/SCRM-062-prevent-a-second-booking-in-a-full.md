---
id: SCRM-062
title: "Prevent a second booking in a full appointment slot"
feature: appointments
priority: P1
tags: [regression, writes, final]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
A full appointment slot cannot be booked by a second QA customer.

## Preconditions
- A staging slot is visibly Full or at its displayed capacity.
- Notification routing is confirmed safe for QA contacts.

## Data
- Full slot selected dynamically.
- Second contact uses QA-only non-routable details.

## Steps
1. Sign in to the staging CRM and open the appointment schedule.
2. Select a slot displayed as Full and attempt to book it for a QA customer.
3. Review the validation and appointment list.

## Expected
- The slot is unavailable or the form rejects the booking.
- No second appointment is created and the slot remains at its prior capacity.

## Notes
Data-changing final scenario. Staging only. Obtain explicit user approval before each run/retry. Use only QA data; never use real customer/payment details. Capacity is limited; use only the staging schedule and QA contact details.
