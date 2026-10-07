---
id: HTA-048
title: "Role period is saved with the dates picked in the calendar"
feature: user-admin
priority: P1
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-07
updated: 2026-10-07
---

## Goal
Role validity periods (used to enable VET IC and Stocktaker roles for FAVE) keep the chosen dates.

## Preconditions
- Logged in as the test account (`HTA_USER` in .env) with Agency Admin active

## Data
- Role Stocktaker (HTA has no Stocktaker)
- Start Date the 13th, End Date the 20th of next month

## Steps
1. User > Role Listing > pencil of Stocktaker > Periods > Add Period
2. Pick Start Date the 13th and End Date the 20th of next month, Submit
3. Cleanup: delete the new period (trash icon)

## Expected
- Step 2 shows "Period has been successfully saved."
- The Periods table lists the period with exactly the picked dates (dd-Mon-yyyy)
- Step 3 shows "Period <start> to <end> has been successfully deleted." and the table is back to its previous rows

## Notes
BUG-004: a day above 12 fails with "SqlDateTime overflow" on HTA too (same as mha-spf BUG-011); marked test.fail while BUG-004 is open. Periods that were not there before the test are deleted before and after.

Automated in tests/e2e/user-admin/role-periods.spec.ts.
