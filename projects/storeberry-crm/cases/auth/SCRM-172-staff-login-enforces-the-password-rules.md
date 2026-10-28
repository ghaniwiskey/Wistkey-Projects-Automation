---
id: SCRM-172
title: "Staff login enforces the password rules and locks out repeated wrong passwords"
feature: auth
priority: P1
tags: [regression, security]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Staff accounts are protected against weak passwords and guessing.

## Preconditions
- A second QA staff account (ask the user first). Never use the shared ghani account: a lockout would block other testers

## Data
- User Security Settings read at runtime

## Steps
1. Try to set a password that breaks the rules
2. Enter a wrong password more times than the setting allows
3. Enter the right password

## Expected
- Weak passwords are refused with the rule shown
- After the limit the account is locked or slowed (per the setting) and the message does not reveal whether the username exists
- Cleanup: unlock/delete the QA staff account

## Notes
Critical flow inside a feature first covered on 2026-10-29 (feature-coverage review follow-up). Never tested.
