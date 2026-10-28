---
id: TWW-061
title: "Server rejects invalid user data sent directly to the API"
feature: security
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Validation does not rely on the browser form.

## Preconditions
- An admin account (TWW_ADMIN_USER / TWW_ADMIN_PASS)

## Steps
1. POST to the users API with password "1"
2. POST with email "not-an-email" and role "SUPERUSER"

## Expected
- Both return 400 "數據驗證失敗" with field details; no user is created
