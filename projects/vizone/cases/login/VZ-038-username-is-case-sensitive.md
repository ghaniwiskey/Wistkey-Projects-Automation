---
id: VZ-038
title: "Username is case sensitive"
feature: login
priority: P3
tags: [regression]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Only the exact username logs in.

## Data
- User: VZ_ADMIN_USER in upper case, correct password

## Steps
1. Open the Studio login page
2. Log in with the username in upper case and the correct password

## Expected
- The message "Incorrect username or password" is shown

## Notes
Observed 2026-10-30 (ADMIN rejected). Confirm with RTHK this is intended.
