---
id: VZ-039
title: "Item link opened while logged out returns to the item after login"
feature: login
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
A shared item link still works for a user who has to log in first.

## Data
- Link: the URL of any item page (#ItemPlace:<id>), found at runtime

## Steps
1. Log in to Viz One Studio with domain Internal accounts and the VZ_ADMIN_USER / VZ_ADMIN_PASS account
2. Copy the URL of an item page and log out
3. Open the copied URL
4. Log in again

## Expected
- After login the same item page opens (its title is in the page heading)
