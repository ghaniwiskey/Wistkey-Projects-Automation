---
id: HLW-005
title: "User role sees only the operations menu"
feature: access
priority: P0
tags: [smoke]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-19
---

## Goal
Menu for the User role

Verify that an account with the User role sees only the operations and gantry log pages in the menu.

## Preconditions
- An account with the User role

## Steps
1. Log in to HTX LIMS web with the User account
2. Open each menu group

## Expected
- The menu shows Dashboard, Inventory (Chemical Usage, Item Information), Registration (Item Register, Asset Tag Printing), Purchase Order (PO Creation, PO Management), Check In / Out (Printed, Tagged Not Checked In, Count Item, Check In, Check Out), Gantry (Gantry Log only) and My Account
- Stock Take, Report, Master Data and System are not in the menu
- The user button shows Role: User

## Notes
Checked by hand 2026-11-18 with USER1 and USER2.

2026-11-19: after the deploy the User role sees Report (10 reports, not Audit Trail) and Check In / Out has Registered Not Printed / Printed Not Pre-Checked In instead of Printed / Count Item: waiting on Q-011 before changing the expected menu.
