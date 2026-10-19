---
id: MHM-004
title: "Switching to Stocktaker and a cost centre shows only that cost centre's stocktakes"
feature: role
priority: P0
tags: [smoke]
envs: [all]
automated: true
created: 2026-10-16
updated: 2026-10-19
---

## Goal
Switch Role changes the active role and cost centre; the home tiles and the Stocktake list follow it.

## Preconditions
- The mobile account holds the Stocktaker role

## Data
- Cost centre: one offered in Select Cost Center that differs from the active one (found at runtime)

## Steps
1. Log in on the app
2. Tap Switch, pick Select Role "Stocktaker", pick the cost centre and tap Confirm
3. Tap Stocktake

## Expected
- Step 2: the bottom bar reads "Stocktaker | <cost centre>" and the home shows Search Asset, Stocktake, New Asset and Settings
- Step 3: the Stocktake title count "(n)" equals the rows listed, and every row is "<cost centre> - <name>" with a FAVE number "FAVE FYaa-20cc"; with none, "Nothing to show yet"

## Notes
Automated in tests/e2e/role/switch-role.spec.ts (screen objects tests/pages/mobile, web page objects tests/pages/web).
Select Cost Center lists the previous role's cost centres until home is shown again (BUG-005, after login all agency cost centres), so the test reads the Stocktaker's own units with HomeScreen.costCentresOf (confirm the role, Settings and back) and switches to one of them other than the current; picking from the login list could land on a unit the Stocktaker does not hold and pass on an empty Stocktake list.
