---
id: SBF-007
title: "Registration validates policy, password length and confirmation"
feature: account
priority: P2
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-30
---

## Goal
Invalid registration input is rejected with clear messages.

## Data
- Password 123 / confirm 456

## Steps
1. Open /register and fill name and a unique email
2. Enter password 123 and confirmation 456, leave the policy unticked, Register

## Expected
- Warning lists "The Agreement of Privacy policy is required.", "The Password must be at least 6 characters." and "The Password confirmation does not match."
- No account is created

## Notes
BUG-003, closed as wont-fix (accepted behavior): an impossible birthday such as 02-30 is accepted and stored as the registration date, so the birthday is no longer checked here.
