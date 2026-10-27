---
id: SBF-018
title: "Forgot password gives the same answer for registered and unknown emails"
feature: account
priority: P2
tags: [regression, security]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
The reset form does not reveal which emails have an account.

## Preconditions
- Logged out

## Data
- A registered QA member email
- A well-formed email with no account

## Steps
1. /forgot-password: submit the registered email
2. Submit the unknown email
3. Submit "notanemail"

## Expected
- Registered and unknown emails get the same neutral confirmation
- Only a malformed address gets a format error

## Notes
2026-10-27: registered -> "Success ... check your mailbox" and redirect to /login; unknown -> "Please provide correct email." (BUG-011).
