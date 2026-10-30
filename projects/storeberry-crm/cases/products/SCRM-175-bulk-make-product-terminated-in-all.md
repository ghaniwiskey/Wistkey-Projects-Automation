---
id: SCRM-175
title: "Bulk \"Make product terminated in all platforms\" terminates only the selected product"
feature: products
priority: P1
tags: [regression, writes, final]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-30
---

## Goal
The bulk terminate action affects only the selected rows.

## Preconditions
- An active QA product created for this test (never select products we did not create)
- Approval for this run: terminating cannot be undone (@final)

## Steps
1. Note the Physical Product and Terminated Products counts
2. Select the QA product row only
3. Actions > Make product terminated in all platforms

## Expected
- The QA product moves to Terminated Products; no other product changes
- Active count -1 and Terminated count +1

## Notes
Gap from the 2026-10-29 review, sixth pass. Never tested. BUG-003, closed as wont-fix (accepted behavior): the action runs at once without a confirmation, so select exactly one own row before clicking it.
