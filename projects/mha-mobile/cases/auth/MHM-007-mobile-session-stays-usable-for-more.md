---
id: MHM-007
title: "Mobile session expires after about 10 minutes and permits a fresh login"
feature: auth
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-16
updated: 2026-10-26
---

## Goal
Confirm the accepted mobile session expiry using a read-only request, then log in again.

## Preconditions
- A FAVE asset is assigned to the mobile officer as stocktaker (see MHM-005)

## Steps
1. Log in, switch to Stocktaker and the cost centre, open the FAVE online without editing or saving a sighting
2. Return to the Stocktake list and wait until 11 minutes after login
3. Reopen the FAVE online to make a read-only server request
4. Log in again

## Expected
- Step 3: the app returns to the login screen without a session-expiry message
- Step 4: login succeeds and the home screen is available

## Notes
Manual (an 11-minute wait per run), read-only: do not edit, save or submit a sighting. BUG-001, closed as wont-fix on 2026-10-26: the ~10-minute expiry, silent return to login and loss of an in-flight sighting are accepted behavior. This case checks expiry and fresh login without deliberately losing data; MHM-005 logs in fresh before its phone steps.
