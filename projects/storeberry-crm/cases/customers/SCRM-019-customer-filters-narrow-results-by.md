---
id: SCRM-019
title: "Customer filters narrow results by registration date, member level, and source platform"
feature: customers
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
Customer directory filters return only records matching the selected criteria.

## Preconditions
- Dedicated Storeberry Flower staging admin account is configured in local .env.

## Data
- Registration-date range and member level selected from available controls.

## Steps
1. Sign in to the staging CRM and open Customers > Customers.
2. Open Filter and select a registration-date range and member level; apply the filter.
3. Reset the filter, select a source platform such as POS, ESHOP, or CMS, and apply it.

## Expected
- Every result matches the selected date range and member level in the first filtered view.
- Every result in the second view matches the selected source platform.
- Counts are dynamic and customer personal data is not copied into reports.

## Notes
Read-only. Do not export or expose customer PII.
