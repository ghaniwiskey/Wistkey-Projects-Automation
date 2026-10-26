---
id: SCRM-007
title: "Customer Remark search filters the directory"
feature: customers
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
A CRM user can use the separate Remark search field to filter the customer directory.

## Preconditions
- The staging Storeberry Flower admin account is configured in local .env.

## Data
- A unique search term that does not occur in any customer remark.

## Steps
1. Sign in to the staging CRM as the Storeberry Flower admin.
2. Open Customers > Customers.
3. Enter the unique no-match term in the Remark search field and run the search.

## Expected
- The customer count is 0 and no customer rows are shown.

## Notes
Manual, read-only scenario. Staging only; do not alter customer records or include customer data in reports.
