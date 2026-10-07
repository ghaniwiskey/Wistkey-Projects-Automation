---
id: HTA-031
title: "LOGS1 sets a future disposal date on a RETIRED asset, which stays RETIRED until that date"
feature: retirement
priority: P1
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-07
updated: 2026-10-07
---

## Goal
Asset > Retirement/Disposal stores a future disposal date without disposing the asset yet, and the date can be cleared again.

## Preconditions
- Logged in as the test account (`HTA_USER` in .env) with Logistics Officer 1 active
- The unit has a RETIRED asset with no disposal date

## Data
- Asset `<asset>`: the first RETIRED asset with no disposal date in Retirement/Disposal (Status filter RETIRED, found at runtime)
- Date `<date>`: one year from today

## Steps
1. Asset > Retirement/Disposal, filter Status **RETIRED**, Search
2. Pencil on `<asset>`, pick `<date>`, Submit
3. Search `<asset>`
4. Pencil on `<asset>`, clear the date, Submit

## Expected
- Step 2 shows "Updating done"
- Step 3: Disposal Date shows `<date>` as dd-Mon-yyyy and the status is still RETIRED
- Step 4 shows "Updating done" and Disposal Date is "-" again

## Notes
Never uses a past date (that disposes the asset at once and cannot be undone). Cleanup clears the date if the test stops halfway.

Automated in tests/e2e/retirement/retirement.spec.ts.
