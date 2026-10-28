---
id: TWW-058
title: "Repeated wrong passwords give a generic message and do not lock the account"
feature: security
priority: P0
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Wrong logins give no hint about which part is wrong. Throttling is not required (BUG-018 accepted as wont-fix).

## Preconditions
- A QA user created by the admin (delete afterwards)

## Steps
1. Log in with a wrong password 20 times in a row
2. Log in with the correct password

## Expected
- Every wrong attempt shows 郵箱或密碼錯誤
- A wrong password and an unknown email give the same message
- The correct password still logs in afterwards (no lockout; accepted behavior)

## Notes
Never run against admin@tungwah.org.
No login throttling is accepted behavior: BUG-018, closed as wont-fix (2026-10-28). Do not re-report it.
