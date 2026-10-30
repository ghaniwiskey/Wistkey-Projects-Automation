---
id: SBF-040
title: "Customer books an appointment on the eShop and staff see it in the CRM"
feature: appointments
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-30
---

## Goal
The customer-side appointment booking at /appointment works end to end.

## Preconditions
- Logged-in QA member
- An appointment resource with a free future slot, found at runtime

## Data
- A future free slot chosen at runtime

## Steps
1. Open /appointment and pick the resource and a free future slot
2. Confirm the booking
3. Open the member account bookings (if shown) and the CRM Appointments list for that date

## Expected
- Step 2: a confirmation with the date and time
- Step 3: the booking shows for the member and in the CRM; the slot is no longer free for another customer
- Cleanup: cancel the booking

## Notes
Gap from the 2026-10-29 critical-flow review (no existing case found by search). Never tested. CRM side is blocked while storeberry-crm BUG-022 (appointments API 403) is open; the eShop part can run alone.
