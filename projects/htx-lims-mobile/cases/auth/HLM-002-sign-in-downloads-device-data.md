---
id: HLM-002
title: "Sign in with the .env account downloads the device data and opens the Dashboard"
feature: auth
priority: P0
tags: [smoke]
envs: [all]
automated: true
created: 2026-11-18
updated: 2026-11-18
---

## Goal
The app accepts an HTX LIMS web account, downloads the device data and opens the Dashboard for that user.

## Preconditions
- Upload queue empty (logging out deletes every record on the device that is not uploaded)

## Steps
1. If signed in: check the Upload queue is empty, then Logout > Log out
2. On "Welcome back", enter the .env username and password, tap Sign in
3. Tap OK on the "Data downloaded" dialog

## Expected
- "Data downloaded" lists Pre Check-in list (new + loan), Storage locations and Stocktake lists & items with counts
- Dashboard opens; the bottom bar shows the user's name and username

## Notes
Automated in tests/e2e/auth/login.spec.ts. Checked by hand on 2026-11-18 with ADMIN: 3 pre check-in items, 5 storage locations, 2 stocktake lists with 6 items.
