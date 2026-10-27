---
id: SBF-007
title: "Registration validates policy, password length, confirmation and birthday"
feature: account
priority: P2
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Invalid registration input is rejected with clear messages.

## Data
- Password 123 / confirm 456
- Birthday 02-30

## Steps
1. Open /register and fill name and a unique email
2. Enter password 123 and confirmation 456, leave the policy unticked, Register
3. Fix the passwords, tick the policy, type birthday 02-30, Register

## Expected
- Warning lists "The Agreement of Privacy policy is required.", "The Password must be at least 6 characters." and "The Password confirmation does not match."
- Birthday 02-30 is rejected; no account is created with a different birthday

## Notes
Second expectation currently fails (registration birthday bug, 2026-10-27).
