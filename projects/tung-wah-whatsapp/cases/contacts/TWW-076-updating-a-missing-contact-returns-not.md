---
id: TWW-076
title: "Updating a missing contact fails without changing data"
feature: contacts
priority: P3
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
API errors are accurate.

## Preconditions
- An admin account (TWW_ADMIN_USER / TWW_ADMIN_PASS)

## Steps
1. Delete a template with contacts
2. PATCH one of its old contact IDs

## Expected
- The request fails and no contact is created or changed
- Accepted behavior (BUG-028, wont-fix): 500 {"error":"更新失敗"} instead of 404

## Notes
BUG-028, closed as wont-fix (2026-10-28): the expected result above checks the accepted behavior.
