---
id: SPF-027
title: "UAO approves a unit FAVE after VET IC and URO submit, and it becomes final"
feature: stocktake-fave
priority: P0
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
The full FAVE approval: VET IC submits, URO submits, UAO approves (the last level on SPF: there is no HQ AO role). The unit's FAVE is then endorsed and read-only for everyone.

## Preconditions
- The test account holds VET IC, URO, UAO and Agency Admin (SPF-A2216GA)
- The current FAVE has a cost centre from FAVE.approvalCostCentres (332100 A&F) that is not approved yet. Approval cannot be undone, so each FAVE allows one run; the test skips when none is left

## Data
- Cost centre 332100 A&F (APD 332600 is kept for the repeatable FAVE tests)

## Steps
1. As **Agency Admin** read **Total Stocktake Report (Endorsed)** on the Dashboard (FAVE Stocktake Overview)
2. As **Verification Team IC/2IC** open the first FAVE, pick the cost centre, **Submit**, **Yes**
3. As **Unit Resource Officer** open it, **Submit**, **Yes**
4. As **Unit Approving Officer** open it, click **Approve**, answer **Yes**
5. Open it again as UAO, URO and VET IC; look at the Summary, Details and Assignment tabs
6. As **Agency Admin** read the Dashboard figure again

## Expected
- Steps 2-3 show "Stocktake FAVE has been submitted."
- As UAO the Summary shows **Approve** and **Reject**; step 4 asks "Please confirm that you want to approve this FAVE." and shows "Stocktake FAVE has been approved."
- The Unit Approving Officer stage shows APPROVED; the cost centre row shows status APPROVED, role Unit Approving Officer
- For UAO, URO and VET IC there is no Submit, Approve or Reject, no Update Result and no Assign Stocktaker (only Search/Clear)
- Total Stocktake Report (Endorsed) is one higher than in step 1

## Notes
Irreversible on UAT: an approved cost centre stays APPROVED for that FAVE. Approved so far on FAVE FY26-2007: 332370 CAD (by hand, 2026-10-06). The user allowed two approvals (CAD by hand + A&F by the test); add more cost centres to FAVE.approvalCostCentres only with the team's OK. A new FAVE (next FY) makes the test run again.

Automated in tests/e2e/stocktake-fave/fave-approval.spec.ts (describe 'final approval'). Run once on 2026-10-06: approved 332100 A&F in FAVE FY26-2007 (passed). With A&F and CAD approved, the test now skips until the next FAVE or until more cost centres are added to FAVE.approvalCostCentres.
