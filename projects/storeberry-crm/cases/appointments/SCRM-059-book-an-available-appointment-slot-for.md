---
id: SCRM-059
title: "Book an available appointment slot for a QA customer"
feature: appointments
priority: P1
tags: [regression, writes, final]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
A QA customer can book an available resource/service slot and receive a recorded appointment.

## Preconditions
- A staging appointment resource and service have an available slot.
- The staging notification route is confirmed safe for a non-routable QA contact.

## Data
- QA customer with example.invalid email and test-only phone.
- Available resource, service, date, and time selected dynamically.

## Steps
1. Sign in to the staging CRM and open Appointments.
2. Choose an available resource, service, date, and time.
3. Enter QA-only contact details and submit the booking.
4. Open the new appointment record.

## Expected
- The appointment record shows the selected service, resource, date, and time.
- The appointment has a confirmed/booked state and is linked to the QA customer.
- No message reaches a real person.

## Notes
Data-changing final scenario. Staging only. Obtain explicit user approval before each run/retry. Use only QA data; never use real customer/payment details. Verify sandbox notification routing before booking; appointment creation may reserve a limited slot or send notifications.
