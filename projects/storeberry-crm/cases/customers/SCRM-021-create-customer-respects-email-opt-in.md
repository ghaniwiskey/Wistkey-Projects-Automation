---
id: SCRM-021
title: "Create customer respects email opt-in and member level"
feature: customers
priority: P0
tags: [smoke, writes, final]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
A CRM user can create a staging customer with an explicit opt-in choice and member level.

## Preconditions
- Dedicated Storeberry Flower staging admin account is configured in local .env.

## Data
- First name: QA-<unique>.
- Email: qa-<unique>@example.invalid.
- Opt-in: No.
- Member level selected from the available levels.

## Steps
1. Sign in to the staging CRM and open Customers > Add Customer.
2. Enter a unique QA first name and a non-routable example.invalid email address.
3. Set Opt-in to No and select a member level.
4. Save the record and reopen it from the customer directory.

## Expected
- The new QA customer appears once in the directory.
- Opt-in remains No and the selected member level is retained after reopening.
- No email or marketing message is sent.

## Notes
Data-changing and final. Staging only. Obtain explicit approval before each run; do not use a real email or customer identity. The created record may remain in staging.
