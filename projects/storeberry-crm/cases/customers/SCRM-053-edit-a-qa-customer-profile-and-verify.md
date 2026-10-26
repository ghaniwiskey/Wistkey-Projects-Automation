---
id: SCRM-053
title: "Edit a QA customer profile and verify saved fields"
feature: customers
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
A CRM user can edit a QA customer name and remark and see the values persist.

## Preconditions
- The staging CRM permits creation of a dedicated QA customer.

## Data
- First name: QA-<unique>.
- Email: qa-<unique>@example.invalid.
- Updated remark: QA profile edit <unique>.

## Steps
1. Sign in to the staging CRM and create a unique QA customer using the supplied non-routable email.
2. Open that customer profile.
3. Change the first name and remark to the unique QA values.
4. Save, reopen the customer, and reload the profile.

## Expected
- The updated first name and remark remain visible after reload.
- The customer email remains the non-routable QA address and no message is sent.

## Notes
Data-changing manual scenario. Staging only. Use a unique QA record and example.invalid email; do not edit a real customer.
