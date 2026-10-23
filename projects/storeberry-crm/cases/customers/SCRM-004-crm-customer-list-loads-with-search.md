---
id: SCRM-004
title: "CRM customer list loads with search controls"
feature: customers
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-23
updated: 2026-10-23
---

## Goal
A CRM user can open the customer list and find the customer search controls.

## Steps
1. Log in to the CRM.
2. Open Customers > Customers.
3. Review the customer list header and search controls.

## Expected
- The customer list loads and shows the total customer count.
- A search field is available for Member ID, Name, Mobile, or Email.
- A separate search field is available for Remark.

## Notes
Read-only; do not expose customer personal data in test reports.
