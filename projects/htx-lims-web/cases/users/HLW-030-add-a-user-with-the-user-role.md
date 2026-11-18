---
id: HLW-030
title: "Add a user with the User role"
feature: users
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
User Management

Verify that an administrator can add a user with the User role who can then log in with that role.

## Data
- Name and username: QA User <unique> / QAUSER<unique>
- Email: qa+<unique>@example.com
- Role: User

## Steps
1. Log in to HTX LIMS web with the administrator account
2. Open System > User Management, click Add User, fill the data with a password and save
3. Log out and log in as the new user

## Expected
- User Management lists the new user with Role User
- The new user logs in and sees the User-role menu

## Notes
May send a welcome email; delete the QA user afterwards. Confirm before running.
