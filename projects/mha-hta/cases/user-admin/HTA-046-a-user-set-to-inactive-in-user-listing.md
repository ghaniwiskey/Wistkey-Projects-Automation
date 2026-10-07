---
id: HTA-046
title: "A user set to INACTIVE in User Listing can no longer log in"
feature: user-admin
priority: P1
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-07
updated: 2026-10-07
---

## Goal
Deactivating an account (leavers, changed appointments) blocks its login.

## Preconditions
- Logged in as the test account (`HTA_USER` in .env) with Agency Admin active
- A "QA auto user" exists (made ACTIVE by the test; created when none exists)

## Data
- User: the first "QA auto user" User Listing finds

## Steps
1. User > User Listing, open the QA user, set Status INACTIVE, Update
2. Search the QA user
3. In a separate browser session, log in with the QA user's Web Login ID (no password)

## Expected
- Step 1 shows "User has been successfully updated."
- Step 2 shows status INACTIVE
- Step 3 is refused with "Invalid username/password." and stays on the login page

Automated in tests/e2e/user-admin/users.spec.ts.
