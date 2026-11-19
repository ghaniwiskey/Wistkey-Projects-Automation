---
id: HLW-053
title: "A deleted user can no longer log in"
feature: users
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-19
updated: 2026-11-19
---

## Goal
Deleting a user in User Management removes their access, including a session that is already open.

## Preconditions
- A QA user with the User role made for this test (HLW-030)

## Steps
1. Log in as the QA user in one browser and keep the session open
2. In another browser log in as administrator, open System > User Management and Delete the QA user (confirm)
3. In the QA user's browser open Check Out
4. Log out and try to log in again as the QA user

## Expected
- The user is no longer listed in User Management
- The open session is refused within a minute (login page or not authorized)
- Logging in again is refused
- Audit Trail records the deletion

## Notes
Coverage review 2026-11-19: only adding a user was covered (HLW-030). Edit User says changes take effect within a minute.
