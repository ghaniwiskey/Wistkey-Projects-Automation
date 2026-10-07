---
id: HTA-047
title: "Role period dialog checks required dates and the date order"
feature: user-admin
priority: P2
tags: [regression]
envs: [staging]
automated: true
created: 2026-10-07
updated: 2026-10-07
---

## Goal
The Add Period dialog of Role Listing validates its dates before saving.

## Preconditions
- Logged in as the test account (`HTA_USER` in .env) with Agency Admin active

## Data
- Role Stocktaker (HTA has no Stocktaker)
- Start Date the 10th, End Date the 5th of next month

## Steps
1. User > Role Listing > pencil of Stocktaker > Periods > Add Period, Submit with empty dates
2. Pick a Start Date after the End Date, Submit
3. Cancel

## Expected
- Step 1 shows "Start date is required." and "End date is required."
- Step 2 shows "The start date must be ealier than the end date" and "The end date must be later than the start date" (mha-spf BUG-015 typo), nothing is saved
- The Periods table is unchanged

## Notes
Nothing is saved.

Automated in tests/e2e/user-admin/role-periods.spec.ts.
