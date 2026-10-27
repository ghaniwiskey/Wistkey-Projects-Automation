---
id: SCRM-073
title: "Add Customer validates email format and password confirmation"
feature: customers
priority: P2
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Invalid email and mismatched passwords block customer creation.

## Data
- Email: not-an-email
- Password: Abc12345! / Confirm: Different99!

## Steps
1. Open Customers > Add Customer
2. Enter First Name AsideQA, pick a language, Email not-an-email, mismatched passwords
3. Click Save
4. Clear Email and Save again

## Expected
- "The Email must be a valid email address." and "The Password confirmation does not match." are shown
- With an empty email "Email is required." is shown
- No customer is created (URL stays /customers/create)
