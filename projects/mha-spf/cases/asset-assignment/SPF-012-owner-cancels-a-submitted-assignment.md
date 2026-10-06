---
id: SPF-012
title: "Owner cancels a submitted assignment with a reason"
feature: asset-assignment
priority: P1
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
The creator of a SUBMITTED transaction can cancel it; Others needs remarks.

## Preconditions
- Logged in as SPF-A2216GA with Logistics Officer 1 active
- Asset 111000010979 is not in an ongoing transaction

## Data
- Asset ID: `111000010979`
- Transaction: Assign to LOGS1 "Wong Pui Lai Annie" (needs Unit Resource Officer approval, so it stays SUBMITTED)
- Cancel reason: Others, remarks `QA cancel <unique>`

## Steps
1. Create an **Assign** transaction for `111000010979` to Role **Logistics Officer 1 (LOGS1)**, Assignee **Wong Pui Lai Annie**.
2. Open the transaction from **Asset > Assignment**.
3. Click **Cancel**, pick reason **Others** and click **Submit** without remarks.
4. Type remarks `QA cancel <unique>`, click **Submit** and confirm with **Yes**.

## Expected
- After step 1 the End step says "created and pending approval" and the list shows SUBMITTED with Approver Role "Unit Resource Officer".
- After step 3 the dialog shows "Remarks is required" and stays open.
- After step 4 the message "Assignment has been cancelled." is shown and the status is CANCELLED.

## Notes
Before and after: cancel any SUBMITTED assignment transaction on asset 111000010979 (owner Cancel, reason Others "QA cleanup"). The manual says LOGS1 taking an asset back to himself is auto-approved, but on UAT (2026-10-06) LOGS1 > LOGS1 "Wong Pui Lai Annie" always goes to the URO; the manual's own example also says "after it approved".

Automated in tests/e2e/asset-assignment/assignment-writes.spec.ts (page objects in tests/pages, cleanup fixtures in tests/fixtures/pages.fixture.ts).
