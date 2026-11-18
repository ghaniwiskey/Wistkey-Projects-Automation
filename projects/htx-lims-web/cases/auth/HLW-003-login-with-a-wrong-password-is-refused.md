---
id: HLW-003
title: "Login with a wrong password is refused"
feature: auth
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Wrong password

Verify that the login page refuses a valid username with a wrong password and does not open the Dashboard.

## Preconditions
- A User account

## Data
- Password: WrongPass<unique>!

## Steps
1. Open the login page
2. Enter a valid username and the wrong password and click Login

## Expected
- The login page stays open with an error message about an invalid login
- Opening /dashboard afterwards shows the login page, not the Dashboard
