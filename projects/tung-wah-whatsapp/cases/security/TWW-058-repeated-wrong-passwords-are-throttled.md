---
id: TWW-058
title: "Repeated wrong passwords are throttled"
feature: security
priority: P0
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Login cannot be brute-forced (the app is public through ngrok).

## Preconditions
- A QA user created by the admin (delete afterwards)

## Steps
1. Log in with a wrong password 20 times in a row
2. Log in with the correct password

## Expected
- After a few failures logins are delayed, locked or need extra verification
- Wrong password and unknown email give the same message

## Notes
Never run against admin@tungwah.org.
Related: BUG-018 (open).
