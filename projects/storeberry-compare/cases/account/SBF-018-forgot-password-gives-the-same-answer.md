---
id: SBF-018
title: "Forgot password confirms registered emails and rejects unknown or malformed ones"
feature: account
priority: P2
tags: [regression, security]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
The reset form sends a reset for registered emails and refuses other input.

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
- Registered email: "Success ... check your mailbox" and redirect to /login
- Unknown well-formed email: "Please provide correct email."
- Malformed address: a format error and no request

## Notes
2026-10-27: registered -> "Success ... check your mailbox" and redirect to /login; unknown -> "Please provide correct email." BUG-011 closed as wont-fix on 2026-10-27: telling registered and unknown emails apart is accepted behavior.
