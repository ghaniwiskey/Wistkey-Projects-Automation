---
id: BUG-022
title: "CRM Appointments module shows no data: every appointment API call returns 403 \"session expired\""
severity: critical
status: open
env: staging
url: "https://www.stagingl10.storeberry.xyz/appointment/list"
updated: 2026-10-27T10:45:09.529Z
found: 2026-10-27T10:45:09.529Z
foundBy: "explorations/2026-10-27-stock-movement.md"
tests: [SCRM-059, SCRM-060, SCRM-061, SCRM-039]
frequency: always
---
## Summary
Appointments > Calendar, Appointments, Resources and Services all show 0 items. Every call to https://cmsapiv2.storeberry.ai/cmsapi/appointment/* (appointment/list, calendar/list, resource/list, service/list, resource/options, service/options, label/options) returns 403 {"statusCode":403,"error":"Forbidden","message":"You page session expired. Please login again or reload the page","code":2208}. The UI swallows the error and shows an empty list. Customers can still book on the eShop (/appointment), so staff cannot see, reschedule or cancel real bookings.

## Steps to reproduce
1. Log out and log in to the staging CRM
2. Open Appointments > Appointments (also Calendar, Resources, Services)
3. Watch the network calls to cmsapiv2.storeberry.ai

## Expected
Appointments, resources and services load (resource 3 "Course" with services Thai and Foot massage exists, and an appointment was booked for 2026-10-29 14:00).

## Actual
Lists show "Total: 1 page(s) (0 items)"; all appointment API calls 403 code 2208, also right after a fresh login (checked twice). Product pages call the same host and get a normal response (500 from BUG-005), so the session is not simply expired.

## Evidence
- Screenshot: ![appointments empty](../explorations/2026-10-27-stock-movement/10-appointments-empty-403.jpg)

## Environment
- Base URL: https://www.stagingl10.storeberry.xyz/appointment/list
- Env: staging

## History
- 2026-10-27: filed from explorations/2026-10-27-stock-movement.md in the Test Manager app.
