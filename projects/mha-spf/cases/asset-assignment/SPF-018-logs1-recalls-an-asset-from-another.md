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
- Logged in as the test account (`SPF_USER` in .env) with Logistics Officer 1 active; the account also holds Unit Resource Officer (added in User > Role Listing on 2026-10-06)
- Asset `<asset>` is not in an ongoing transaction

## Data
- Asset `<asset>`: found when the test runs (writableAsset): selectable in Assign > Choose Asset, preferably with the test account as current LOGS1; all assignment write tests of a run share it (UAT 2026-10-06: `<asset>`)
- Other FALO `<other FALO>`: the first FALO in the Assignee list who is not the test account (UAT 2026-10-06: <other FALO>)
- Recall to: Logistics Officer 1 (LOGS1) `<officer>` (the test account's officer, read from the page header)

## Steps
1. As **Logistics Officer 1**, create an **Assign** transaction for `<asset>` to Role **Fixed Asset Liaison Officer (FALO)**, Assignee **<other FALO>**. -> Expect: "created and approved"; Ownership shows Current FALO "<other FALO>".
2. Create an **Assign** transaction for `<asset>` to Role **Logistics Officer 1 (LOGS1)**, Assignee **`<officer>`**.
3. Switch the role to **Unit Resource Officer**, open the transaction from **Asset > Assignment**, click **Approve** and confirm with **Yes**.
4. Open asset `<asset>` and go to the **Ownership** tab.

## Expected
- After step 2 the End step says "created and pending approval" and the list shows SUBMITTED with Approver Role "Unit Resource Officer".
- As URO the transaction shows **Approve** and **Reject**; after approving, "Assignment has been approved" is shown and the status is APPROVED.
- Ownership shows Current LOGS1 `<officer>` and Current FALO "-" (empty).

## Notes
Verified manually 2026-10-06 (ASG00006318/ASG00006319). With a different FALO the FALO ownership is cleared as the manual says; retested the same day with the test account as FALO and it is cleared too (ASG00006333). Emails go to <other FALO> and the URO. Cleanup: cancel any SUBMITTED transaction on `<asset>` before and after.

Automated in tests/e2e/asset-assignment/assignment-writes.spec.ts.
