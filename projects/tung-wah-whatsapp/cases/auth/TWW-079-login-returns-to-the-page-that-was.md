---
id: TWW-079
title: "Login returns to the page that was requested"
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
- After login the user lands on /users
- A logged-in user opening /login is sent to /templates

## Notes
Related: BUG-030 (open).
