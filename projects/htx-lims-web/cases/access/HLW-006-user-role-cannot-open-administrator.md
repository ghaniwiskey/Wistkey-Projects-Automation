---
id: HLW-006
title: "User role cannot open administrator pages by address"
feature: access
priority: P0
tags: [smoke]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Admin pages blocked for the User role

Verify that a User-role account typing the address of an administrator page gets the Not Authorized page and no data.

## Preconditions
- An account with the User role

## Data
- Addresses: /usermanagement, /stocktake, /stocktakelist, /itemcategory, /gantrysetup, /gantrywhitelist, /audittrail, /stockreport/level

## Steps
1. Log in to HTX LIMS web with the User account
2. Open each address in the data list

## Expected
- Every address shows "You're Not Authorized! Your account does not have access to this page."
- No table, button or record of the page is shown

## Notes
Checked by hand 2026-11-18 with USER1 (all blocked).
