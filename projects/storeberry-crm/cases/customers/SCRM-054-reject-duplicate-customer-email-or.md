---
id: SCRM-054
title: "Reject duplicate customer email or Member ID values"
feature: customers
priority: P2
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
Customer creation prevents a duplicate email or editable Member ID from creating a second record.

## Preconditions
- At least one dedicated QA customer exists; Member ID branch requires that the CRM UI permits setting a Member ID.

## Data
- Existing QA customer email and, if editable, Member ID selected dynamically.
- Second customer uses a unique QA first name and example.invalid email for the untested identifier.

## Steps
1. Sign in to the staging CRM and open Add Customer.
2. Attempt to save a second QA customer with the existing QA customer email.
3. Verify the duplicate is rejected and no second record is created.
4. If Member ID can be set in the form, repeat with the existing QA Member ID and a unique email.

## Expected
- Duplicate email is rejected with a visible validation message and no duplicate customer appears.
- If Member ID is editable, duplicate Member ID is likewise rejected without creating a record.

## Notes
Validation-only. Do not create or edit real customer records. If Member ID cannot be set through supported UI, mark only that branch not applicable.
