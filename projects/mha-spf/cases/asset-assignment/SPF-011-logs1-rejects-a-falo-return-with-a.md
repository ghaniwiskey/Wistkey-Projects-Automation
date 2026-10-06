---
id: SPF-011
title: "LOGS1 rejects a FALO return with a reason"
feature: asset-assignment
priority: P1
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
The approver can reject a SUBMITTED assignment with a predefined reason.

## Preconditions
- Asset 111000010979 is assigned to FALO "Wong Pui Lai Annie"
- Logged in as SPF-A2216GA

## Data
- Asset ID: `111000010979`
- Reject reason: Incorrect Assignee

## Steps
1. As **Fixed Asset Liaison Officer**, create an **Assign** transaction for `111000010979` to LOGS1 "Wong Pui Lai Annie".
2. Switch to **Logistics Officer 1** and open the new transaction.
3. Click **Reject**, pick reason **Incorrect Assignee**, click **Submit** and confirm with **Yes**.

## Expected
- The message "Assignment has been rejected." is shown.
- The transaction status is REJECTED and the detail page shows "Rejected By" and the reason "Incorrect Assignee".

## Notes
Before and after: cancel any SUBMITTED assignment transaction on asset 111000010979 (owner Cancel, reason Others "QA cleanup").

Automated in tests/e2e/asset-assignment/assignment-writes.spec.ts (page objects in tests/pages, cleanup fixtures in tests/fixtures/pages.fixture.ts).
