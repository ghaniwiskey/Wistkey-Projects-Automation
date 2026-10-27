---
id: SCRM-072
title: "Delete removes only the selected QA customer"
feature: customers
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Deleting one ticked customer removes exactly that record.

## Preconditions
- A QA customer created for this test

## Data
- Customer email: aside.<unique>@example.com

## Steps
1. Search the customer list for the QA email
2. Tick only its row checkbox (not Select All)
3. Click Delete and read the confirmation
4. Click OK
5. Search the QA email again and note the total customer count

## Expected
- Confirmation reads "Are you sure want to delete selected customers?"
- After OK the search shows No. of Customer: 0
- Total count drops by exactly 1
- Opening the old detail URL redirects to the customer list

## Notes
Never use Select All. Verified manually 2026-10-27 (MEMy001164524).
