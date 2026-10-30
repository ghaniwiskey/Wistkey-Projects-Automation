---
id: TWW-059
title: "Deleting a user ends their sessions"
feature: security
priority: P0
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-30
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
Deleted users must lose API access immediately and dashboard pages must redirect to /login. BUG-019 and BUG-035 verified; latest retest runs/2026-10-30_1349_local_manual used a temporary viewer.
