---
id: SBF-062
title: "Member notification inbox shows order and payment messages"
feature: account
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Members see their notifications on the eShop.

## Preconditions
- A QA member with a recent order and accepted payment (SBF-041)

## Steps
1. Open /notification while logged in
2. Open it while logged out

## Expected
- Order and payment notifications for the member are listed, newest first, and open
- Logged out redirects to /login

## Notes
Feature with no cases before the 2026-10-29 feature-coverage review (menu/page found in the live staging app). Never tested. Related: the CRM Message Centre case.
