---
id: SCRM-139
title: "CRM pages are not reachable after logout or without login"
feature: auth
priority: P1
tags: [regression, security]
envs: [all]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Customer and order data in the CRM cannot be opened without a valid staff session.

## Preconditions
- Logged in as the .env staff account

## Data
- URLs of the order list, an order detail, the customer list and Web POS, read at runtime

## Steps
1. Copy the URLs, then log out
2. Press Back
3. Open each URL directly in the same and in a fresh browser

## Expected
- Every URL redirects to /auth/login
- Back after logout shows no data and allows no action

## Notes
Gap from the 2026-10-29 critical-flow review, second pass (no existing case found by search). Never tested.
