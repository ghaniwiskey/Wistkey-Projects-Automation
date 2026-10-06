---
id: SPF-018
title: "LOGS1 recalls an asset from another FALO and the URO approval clears the FALO"
feature: asset-assignment
priority: P1
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
Recall (manual > How to recall the asset): LOGS1 assigns an asset held by a FALO back to himself; it needs URO approval, and after approval the FALO ownership is empty.

## Preconditions
- Logged in as SPF-A2216GA with Logistics Officer 1 active; the account also holds Unit Resource Officer (added in User > Role Listing on 2026-10-06)
- Asset 111000010979 is not in an ongoing transaction

## Data
- Asset ID: `111000010979`
- Other FALO: "Chia Shu Hui" (a different officer than the test account)
- Recall to: Logistics Officer 1 (LOGS1) "Wong Pui Lai Annie"

## Steps
1. As **Logistics Officer 1**, create an **Assign** transaction for `111000010979` to Role **Fixed Asset Liaison Officer (FALO)**, Assignee **Chia Shu Hui**. -> Expect: "created and approved"; Ownership shows Current FALO "Chia Shu Hui".
2. Create an **Assign** transaction for `111000010979` to Role **Logistics Officer 1 (LOGS1)**, Assignee **Wong Pui Lai Annie**.
3. Switch the role to **Unit Resource Officer**, open the transaction from **Asset > Assignment**, click **Approve** and confirm with **Yes**.
4. Open asset 111000010979 and go to the **Ownership** tab.

## Expected
- After step 2 the End step says "created and pending approval" and the list shows SUBMITTED with Approver Role "Unit Resource Officer".
- As URO the transaction shows **Approve** and **Reject**; after approving, "Assignment has been approved" is shown and the status is APPROVED.
- Ownership shows Current LOGS1 "Wong Pui Lai Annie" and Current FALO "-" (empty).

## Notes
Verified manually 2026-10-06 (ASG00006318/ASG00006319). With a different FALO the FALO ownership is cleared as the manual says; in SPF-010 (FALO and LOGS1 are the same officer) it is not. Emails go to Chia Shu Hui and the URO. Cleanup: cancel any SUBMITTED transaction on 111000010979 before and after.

Automated in tests/e2e/asset-assignment/assignment-writes.spec.ts.
