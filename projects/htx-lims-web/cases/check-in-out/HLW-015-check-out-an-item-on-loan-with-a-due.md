---
id: HLW-015
title: "Check out an item on loan with a due date"
feature: check-in-out
priority: P0
tags: [smoke, writes]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Check Out on loan

Verify that a checked-in item can be checked out on loan with a due date and shows in the Loan Out Report.

## Preconditions
- At least one item with status IN

## Data
- Purpose: Loan
- Due Date: today + 7 days
- Remarks: QA loan <unique>

## Steps
1. Log in to HTX LIMS web with a User account
2. Open Check In / Out > Check Out and tick the first item
3. Set Purpose Loan, Due Date and Remarks, keep the storage location
4. Click Check Out and confirm

## Expected
- A success message is shown and the item leaves Checked-In Items
- Item Information shows the item with Status OUT
- Report > Loan Out Report lists the item with the due date
- Report > Check In Out Report shows a LOAN check-out by the user
- Gantry > Gantry Whitelist lists the item, and Report > Stock Level Report shows it under On loan with the item type's Stock unchanged

## Notes
Clean-up: check the item in again.
