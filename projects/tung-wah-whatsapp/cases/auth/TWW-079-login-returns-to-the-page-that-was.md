---
id: TWW-079
title: "Login lands on 消息模版"
feature: auth
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Deep links work after logging in.

## Preconditions
- An admin account (TWW_ADMIN_* or TWW_QA_ADMIN_* in .env)

## Steps
1. While logged out open /users (redirects to /login?callbackUrl=/users)
2. Log in as admin
3. While logged in open /login

## Expected
- Accepted behavior (BUG-030, wont-fix): after login the user lands on /templates, also when callbackUrl points to another page
- A logged-in user opening /login sees the login form (accepted, BUG-030)

## Notes
BUG-030, closed as wont-fix (2026-10-28): the expected result above checks the accepted behavior.
