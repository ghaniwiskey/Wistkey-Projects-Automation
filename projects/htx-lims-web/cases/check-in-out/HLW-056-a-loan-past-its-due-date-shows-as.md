---
id: HLW-056
title: "A loan past its due date shows as Overdue in the Loan Out Report"
feature: check-in-out
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-19
updated: 2026-11-19
---

## Goal
A loan that is still out after its due date is reported as Overdue.

## Preconditions
- An item with status IN

## Data
- Purpose: Loan, Due Date: tomorrow, Remarks: QA overdue <unique>

## Steps
1. Log in to HTX LIMS web with a User account and check the item out on Loan due tomorrow
2. Two days later open Report > Loan Out Report and set Loan status Overdue
3. Look at the Dashboard

## Expected
- The loan is listed under Overdue with its due date and no Returned On
- It is also listed under On loan (incl. overdue)
- Whether the Dashboard raises an overdue alert is noted (no alert type for it is known)

## Notes
Coverage review 2026-11-19: Loan Out Report has Loan status All / On loan (incl. overdue) / Overdue / Returned ("Overdue means still on loan after the due date"). Past due dates cannot be picked (HLW-043), so the test needs a 2-day wait or an existing overdue loan. Clean-up: check the item in again.
