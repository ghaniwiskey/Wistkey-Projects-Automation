---
id: TWW-011
title: "Editor cannot use user management"
feature: security
priority: P0
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Only admins can list or create users.

## Preconditions
- An editor account (create one as admin, delete afterwards)

## Steps
1. Log in as an editor (create a QA editor first)
2. Request the users API (list) and try to create a user with role 管理員 through it
3. Open /users

## Expected
- List and create return 403 "無權限"
- The users page does not show the user list or the add button to an editor

## Notes
API part passed on 2026-10-28; the /users page for an editor was not checked in the UI (no second browser session).
