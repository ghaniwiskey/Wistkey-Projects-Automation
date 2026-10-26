---
id: SCRM-006
title: "Customer search by Member ID returns the selected customer"
feature: customers
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
A CRM user can locate one existing customer by an exact Member ID.

## Preconditions
- The staging Storeberry Flower admin account is configured in local .env.
- At least one customer with a unique Member ID is available in staging.

## Data
- The Member ID of the selected staging customer; do not copy customer details into reports.

## Steps
1. Sign in to the staging CRM as the Storeberry Flower admin.
2. Open Customers > Customers.
3. Select one existing customer and note its Member ID privately.
4. Enter that exact Member ID in the customer search field and run the search.

## Expected
- The customer count is 1 and one matching customer row is shown.
- The search result corresponds to the selected customer; no personal customer details are included in the test report.

## Notes
Manual, read-only scenario. Staging only; do not alter customer records.
