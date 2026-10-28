---
id: SCRM-152
title: "Staff set up an appointment resource, service and label and customers can book it"
feature: appointments
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
The appointment catalogue that customers book from can be maintained.

## Preconditions
- Appointments module working (blocked while BUG-022 is open)

## Data
- QA resource, service and label names with a unique suffix

## Steps
1. Create a label category and label, a resource and a service linked to it
2. Open /appointment on the eShop

## Expected
- The new service/resource is bookable on the eShop with the set duration and price
- Cleanup: delete the QA service, resource and label

## Notes
Feature with no cases before the 2026-10-29 feature-coverage review (menu/page found in the live staging app). Never tested. Blocked by BUG-022 (appointment API 403).
