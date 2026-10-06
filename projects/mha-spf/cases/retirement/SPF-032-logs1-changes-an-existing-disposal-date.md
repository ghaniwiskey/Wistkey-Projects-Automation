---
id: SPF-032
title: "LOGS1 changes an existing disposal date"
feature: retirement
priority: P2
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
A disposal date that is already set on a RETIRED asset can be changed to another future date from the same Update dialog.

## Preconditions
- Logged in as the test account (`SPF_USER` in .env) with Logistics Officer 1 active
- The unit has a RETIRED asset with no disposal date

## Data
- Asset `<asset>`: the first RETIRED asset with no disposal date (found at runtime)
- Date `<date1>`: one year from today, moved to the 20th; `<date2>`: one month after `<date1>` (both in the future, so the asset is never disposed)

## Steps
1. Set `<date1>` on `<asset>` (pencil, pick the date, Submit)
2. Open the pencil on `<asset>` again, pick `<date2>`, Submit
3. Search `<asset>`

## Expected
- Step 1 shows "Updating done" and the list shows `<date1>` (dd-Mon-yyyy)
- Step 2 shows "Updating done"
- Step 3 shows Disposal Date `<date2>` and status RETIRED

## Notes
Reopening the dialog pre-fills a different date than the saved one (BUG-005, closed as wont-fix: accepted behaviour). The test does not check the pre-filled value and always picks the date before submitting. Cleanup clears the date.

Automated in tests/e2e/retirement/retirement.spec.ts.