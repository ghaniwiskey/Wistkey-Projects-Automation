---
id: HTA-045
title: "Agency Admin assigns a user to a role, the user logs in with it, and the role is removed again"
feature: user-admin
priority: P0
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-07
updated: 2026-10-07
---

## Goal
Role Listing > Users gives a user a role that takes effect at the next login, and removing it takes it away.

## Preconditions
- Logged in as the test account (`HTA_USER` in .env) with Agency Admin active
- A "QA auto user" exists (made ACTIVE by the test; created when none exists)

## Data
- Role Stocktaker (lowest rights on HTA, which has no Stocktaker; any role works)
- User: the first "QA auto user" User Listing finds

## Steps
1. User > Role Listing > pencil of Stocktaker > Users > Add User, search the QA user, tick it, Submit
2. User > User Listing, search the QA user
3. In a separate browser session, log in with the QA user's Web Login ID
4. Back as Agency Admin: Role Listing > Stocktaker > Users, delete the QA user
5. User > User Listing, search the QA user

## Expected
- Step 1 shows "User assign into role have been successfully updated." and the Users tab lists the QA user (ACTIVE)
- Step 2 shows "Stocktaker" under Role Mapped
- Step 3 opens the Dashboard with Role "Stocktaker" and the QA user's name in the header
- Step 4 shows "Stocktaker role has been removed from User <name>." without a confirmation, and the Users tab no longer lists the user
- Step 5 shows no role mapped

## Notes
mha-spf BUG-013: the user form Roles tab keeps a blank EXPIRED row after removal (not asserted). Cleanup removes the QA user from Stocktaker before and after.

Automated in tests/e2e/user-admin/users.spec.ts.
