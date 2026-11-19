---
id: HLW-054
title: "Changing a user's role takes effect at the next login"
feature: users
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-19
updated: 2026-11-19
---

## Goal
Raising a User to Administrator (and back) in Edit User changes the menu and access as the dialog says ("Takes effect within a minute; the user may need to login again").

## Preconditions
- A QA user with the User role (HLW-030)

## Steps
1. Log in as administrator, open System > User Management, Edit the QA user, set Role Administrator and Save
2. Log in as the QA user and open Report > Audit Trail by address (/audittrail)
3. As administrator set the QA user back to Role User and Save
4. Log in again as the QA user and open /audittrail

## Expected
- User Management shows the new role after each save
- As Administrator the QA user sees the full menu and can open Audit Trail
- Back as User the menu has no Report, Stock Take, Master Data or System and /audittrail shows "You're Not Authorized!"

## Notes
Coverage review 2026-11-19. Add User needs Role picked again (BUG-006): check whether Edit User has the same problem.
