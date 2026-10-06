---
id: SPF-010
title: "FALO returns an asset to LOGS1 and LOGS1 approves it"
feature: asset-assignment
priority: P1
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
Assignment from FALO to LOGS1 waits for LOGS1 approval; after approval the LOGS1 becomes the owner.

## Preconditions
- Asset 111000010979 is assigned to FALO "Wong Pui Lai Annie" (set up by an auto-approved LOGS1 > FALO assignment)
- Logged in as SPF-A2216GA

## Data
- Asset ID: `111000010979`
- Assignee: Logistics Officer 1 (LOGS1) "Wong Pui Lai Annie"

## Steps
1. Switch the role to **Fixed Asset Liaison Officer**.
2. Create an **Assign** transaction for `111000010979` with Role **Logistics Officer 1 (LOGS1)**, Assignee **Wong Pui Lai Annie** and **Submit**.
3. Switch the role to **Logistics Officer 1**, open **Asset > Assignment** and open the new transaction.
4. Click **Approve** and confirm with **Yes**.

## Expected
- After step 2 the End step shows "Asset Assignment #ASG<number> is created and pending approval."
- In the list the transaction is SUBMITTED with Approver Role "Logistics Officer 1"; the detail page shows **Approve**, **Reject** and **Cancel** for LOGS1.
- After step 4 the message "Assignment has been approved" is shown and the status is APPROVED.
- The asset Ownership tab shows Current LOGS1 "Wong Pui Lai Annie".

## Notes
Before and after: cancel any SUBMITTED assignment transaction on asset 111000010979 (owner Cancel, reason Others "QA cleanup"). Observed 2026-10-06: after the return is approved, Current FALO still shows "Wong Pui Lai Annie" although the manual says the FALO ownership is emptied; because the FALO and LOGS1 are the same officer: with a different FALO the FALO is cleared (verified 2026-10-06, see SPF-018). Not asserted here.

Automated in tests/e2e/asset-assignment/assignment-writes.spec.ts (page objects in tests/pages, cleanup fixtures in tests/fixtures/pages.fixture.ts).
