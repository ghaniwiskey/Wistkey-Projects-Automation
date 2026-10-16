---
id: MHM-002
title: "Stocktaker logs in on the mobile app with the account from .env"
feature: auth
priority: P0
tags: [smoke]
envs: [all]
automated: true
created: 2026-10-16
updated: 2026-10-16
---

## Goal
The mobile login accepts the test account (passwordless on UAT) and opens the home screen with the officer and the active role.

## Preconditions
- The mobile account (MHM_USER, the full NRIC) exists on UAT
- The Android emulator runs with the MHA app (com.iconsult.mhasgtwo) installed

## Data
- Username: MHM_USER from .env (never typed into the report)
- Password: empty (passwordless UAT account)
- Agency: SPF

## Steps
1. Open the app; if it restores a session, tap Switch > Logout
2. Type the mobile login, leave the password empty, keep agency SPF and tap LOGIN
3. Tap Switch

## Expected
- Step 1: the login screen shows the username and password fields, agency SPF and LOGIN
- Step 2: the home screen shows the officer name and "<role> | <cost centre>" in the bottom bar
- Step 3: the "Switch Role" panel shows Select Role, Select Cost Center, Confirm and Logout

## Notes
Automated in tests/e2e/auth/login.spec.ts (screen objects tests/pages/mobile, web page objects tests/pages/web).
The app keeps the session across restarts, so the test logs out first when needed. After login the active role is the first one (Agency Admin on UAT), which has no home tiles.
