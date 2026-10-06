---
id: SPF-032
title: "The disposal date dialog shows the saved disposal date"
feature: retirement
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-06
updated: 2026-10-06
---

## Goal
Reopening the Retirement/Disposal pencil pre-fills the date that is saved, so submitting it again does not change the date.

## Preconditions
- Logged in as the test account (`SPF_USER` in .env) with Logistics Officer 1 active
- The unit has a RETIRED asset with no disposal date

## Data
- Asset `<asset>`: the first RETIRED asset with no disposal date (found at runtime)
- Date `<date>`: one year from today, on a day after the 12th (so a day/month mix-up is visible)

## Steps
1. Set `<date>` on `<asset>` (pencil, pick the date, Submit)
2. Open the pencil on `<asset>` again

## Expected
- The Disposal Date field shows `<date>` (mm/dd/yyyy)

## Notes
Known bug BUG-005 (31-Dec-2027 shows as 07/12/2029): the test is marked as expected to fail. Cleanup clears the date.
