---
id: TWW-081
title: "Logout invalidates the session token"
feature: security
priority: P0
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-29
---

## Goal
A copied session token stops working after logout.

## Preconditions
- A QA user

## Steps
1. Log in as the QA user in a separate HTTP session and keep the session cookie
2. Log out (signout)
3. Call /api/auth/session and an API with the kept cookie

## Expected
- The old cookie is rejected after logout

## Notes
Fails on BUG-036 (open), split out of BUG-019 on 2026-10-29.
