---
id: SCRM-020
title: "Add Customer requires First Name and Email"
feature: customers
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
The Add Customer form blocks submission when required identity fields are missing.

## Preconditions
- Dedicated Storeberry Flower staging admin account is configured in local .env.

## Steps
1. Sign in to the staging CRM and open Customers > Add Customer.
2. Leave First Name and Email blank.
3. Select Save.

## Expected
- The form stays open and indicates that First Name and Email are required.
- No customer record is created and the customer count does not increase.

## Notes
Validation-only. No customer data is entered or created.
