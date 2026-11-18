---
id: HLM-010
title: "A User-role account signs in on the handheld"
feature: auth
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
User role on the handheld

Verify that an account with the User role can sign in on the handheld, downloads the device data and sees its name in the bottom bar.

## Preconditions
- An account with the User role
- Upload queue empty (signing out deletes device data)

## Steps
1. On the handheld check that the Upload queue is empty, then Logout > Log out
2. Sign in with the User account and tap OK on Data downloaded

## Expected
- Data downloaded lists the Pre Check-in list, storage locations and stocktake lists
- The Dashboard shows the user's name and username in the bottom bar and the task tiles

## Notes
Executed 2026-11-18 with USER1: pass; USER1 sees all 7 tiles including Stocktake and can select stock takes (on the web the User role has no Stock Take pages).
