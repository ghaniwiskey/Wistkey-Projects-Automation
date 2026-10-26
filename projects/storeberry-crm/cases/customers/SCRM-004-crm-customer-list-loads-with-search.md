---
id: SCRM-004
title: "CRM customer list loads with search controls"
feature: customers
priority: P1
tags: [regression]
envs: [staging]
automated: true
created: 2026-10-23
updated: 2026-10-26
---

## Goal
A CRM user can open the customer list and search without exposing customer data in test reports.

## Steps
1. Sign in to the CRM as the staging store admin.
2. Open Customers > Customers.
3. Confirm the customer count and both search controls are available.
4. Search for a unique value that should not match any member.

## Expected
- The customer list loads and displays a numeric total.
- A search field is available for Member ID, Name, Mobile, or Email, and a separate search field is available for Remark.
- The unique no-match search returns `No. of Customer: 0`.

## Notes
Read-only; do not expose customer personal data in test reports. Automated in tests/e2e/customers/search.spec.ts (page object tests/pages/customers.page.ts).
