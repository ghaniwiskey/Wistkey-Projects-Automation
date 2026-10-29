---
id: TWW-060
title: "Role change applies to existing sessions"
feature: security
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-29
---

## Goal
Demoting a user takes effect without waiting for re-login.

## Preconditions
- A QA editor logged in in a separate session

## Steps
1. As admin change the QA user to 查看者
2. Read the QA user's session / try an editor action

## Expected
- The session shows VIEWER (or the user must log in again)

## Notes
Related: BUG-019 verified 2026-10-29 (dev fix af9a789).
