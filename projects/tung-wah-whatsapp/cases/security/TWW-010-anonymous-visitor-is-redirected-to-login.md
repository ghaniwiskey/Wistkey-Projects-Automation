---
id: TWW-010
title: "Anonymous visitor is redirected to login"
feature: security
priority: P0
tags: [smoke]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Pages and APIs are not available without a session.

## Steps
1. Without logging in, open /templates and /users
2. Without a session, request /api/templates and /api/users

## Expected
- Each request redirects (307) to /login with a callbackUrl
- No template, user or contact data is returned
