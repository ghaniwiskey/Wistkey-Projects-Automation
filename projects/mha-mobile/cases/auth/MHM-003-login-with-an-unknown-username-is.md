---
id: MHM-003
title: "Login with an unknown username is refused"
feature: auth
priority: P2
tags: [regression]
envs: [all]
automated: true
created: 2026-10-16
updated: 2026-10-16
---

## Goal
A username that has no account cannot log in and gets a clear message.

## Data
- Username: QA-NOUSER-<unique> (no such account, so no real account gets a failed attempt)

## Steps
1. Open the app logged out (Switch > Logout when a session is restored)
2. Type the unknown username, leave the password empty and tap LOGIN
3. Tap OK

## Expected
- Step 2: a "Login failed" dialog says "Your username or password is incorrect." and "Please try again."
- Step 3: the dialog closes and the login screen stays (LOGIN still shown, no bottom bar)

## Notes
Automated in tests/e2e/auth/login.spec.ts (screen objects tests/pages/mobile, web page objects tests/pages/web).
Production locks an account after 3 failed attempts (user manual); an unknown username has no account to lock.
