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
- Asset `<asset>` is assigned to FALO `<officer>` (the test account's officer, read from the page header) (set up by an auto-approved LOGS1 > FALO assignment)
- Logged in as the test account (`SPF_USER` in .env)

## Data
- Asset `<asset>`: found when the test runs (writableAsset): selectable in Assign > Choose Asset, preferably with the test account as current LOGS1; all assignment write tests of a run share it (UAT 2026-10-06: `<asset>`)
- Assignee: Logistics Officer 1 (LOGS1) `<officer>`

## Steps
1. Switch the role to **Fixed Asset Liaison Officer**.
2. Create an **Assign** transaction for `<asset>` with Role **Logistics Officer 1 (LOGS1)**, Assignee **`<officer>`** and **Submit**.
3. Switch the role to **Logistics Officer 1**, open **Asset > Assignment** and open the new transaction.
4. Click **Approve** and confirm with **Yes**.

## Expected
- After step 2 the End step shows "Asset Assignment #ASG<number> is created and pending approval."
- In the list the transaction is SUBMITTED with Approver Role "Logistics Officer 1"; the detail page shows **Approve**, **Reject** and **Cancel** for LOGS1.
- After step 4 the message "Assignment has been approved" is shown and the status is APPROVED.
- The asset Ownership tab shows Current LOGS1 `<officer>` and Current FALO "-" (FALO ownership emptied, as the manual says).

## Notes
Before and after: cancel any SUBMITTED assignment transaction on asset `<asset>` (owner Cancel, reason Others "QA cleanup"). Retested 2026-10-06 with every step approved (ASG00006334/ASG00006335): Current FALO is cleared even though the FALO and LOGS1 are the same officer. An earlier check (ASG00006278) kept the FALO; the only difference was that the asset had no LOGS1 owner before the return, which cannot be recreated in the UI.

Automated in tests/e2e/asset-assignment/assignment-writes.spec.ts (page objects in tests/pages, cleanup fixtures in tests/fixtures/pages.fixture.ts).
