---
id: VZ-036
title: "Wrong password is rejected with a clear message"
feature: login
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
A wrong password does not log in and says why.

## Data
- User: VZ_ADMIN_USER, password: wrong-<unique>

## Steps
1. Open the Studio login page
2. Log in with VZ_ADMIN_USER and a wrong password

## Expected
- The page stays on the login form
- The message "Incorrect username or password" is shown

## Notes
Do not repeat many times in a row: account lockout policy unknown.
