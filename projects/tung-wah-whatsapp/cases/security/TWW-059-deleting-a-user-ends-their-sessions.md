---
id: TWW-059
title: "Deleting a user ends their sessions"
feature: security
priority: P0
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-29
---

## Goal
A removed staff member loses access immediately.

## Preconditions
- A QA user logged in in a separate session

## Steps
1. As admin delete the QA user
2. With the QA user's existing session, open /templates and call the templates API

## Expected
- The old session is rejected (401/redirect to /login)

## Notes
BUG-019 verified 2026-10-29: the APIs return 401 for a deleted user. Fails on BUG-035 (open): the dashboard pages crash with 500 instead of redirecting to /login.
