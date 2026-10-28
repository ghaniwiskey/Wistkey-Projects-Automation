---
id: TWW-076
title: "Updating a missing contact returns not found"
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
- 404, not 500

## Notes
Currently 500 "更新失敗".
Related: BUG-028 (open).
