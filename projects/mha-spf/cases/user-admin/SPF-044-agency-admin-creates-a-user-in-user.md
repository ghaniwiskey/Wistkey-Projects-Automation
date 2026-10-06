---
id: SPF-044
title: "Agency Admin creates a user in User Listing"
feature: user-admin
priority: P1
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
Agency Admin can add a new ATS user; mandatory fields and duplicate login IDs are checked.

## Preconditions
- Logged in as the test account (`SPF_USER` in .env) with Agency Admin active

## Data
- Web Login ID `QA-AUTO-<unique>`, Name `QA auto user <unique>`
- Unit: the first unit offered in the form (found at runtime)
- Status ACTIVE

## Steps
1. User > User Listing > Create, click Create with an empty form
2. Fill Web Login ID, Name, Unit and Status ACTIVE, click Create
3. Search the Web Login ID in User Listing
4. Create another user with the same Web Login ID
5. Cleanup: open the new user, set Status INACTIVE, Update

## Expected
- Step 1 shows "Web Login ID or Mobile Login ID is required.", "Unit is required.", "Name is required." and "Status is required."
- Step 2 shows "User has been successfully created." and returns to User Listing
- Step 3 lists one row with the login ID, name, unit and ACTIVE, and no role mapped
- Step 4 is refused with "Login ID already exist!"
- Step 5 shows "User has been successfully updated." and the row shows INACTIVE

## Notes
SPF has no user delete (HTA only), so every run leaves one INACTIVE "QA auto user". SPF-045/046 reuse the first one User Listing finds.

Automated in tests/e2e/user-admin/users.spec.ts.
