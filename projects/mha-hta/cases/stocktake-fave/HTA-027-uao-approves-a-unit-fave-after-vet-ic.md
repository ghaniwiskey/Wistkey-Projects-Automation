---
id: HTA-027
title: "UAO approves a unit FAVE after VET IC and URO submit, and it becomes final"
feature: stocktake-fave
priority: P0
tags: [regression, writes, final]
envs: [staging]
automated: true
created: 2026-10-07
updated: 2026-10-07
---

## Goal
The full FAVE approval: VET IC submits, URO submits, UAO approves (the last level: HTA has no HQ AO role). The unit's FAVE is then endorsed and read-only for everyone.

## Preconditions
- The test account holds VET IC, URO, UAO and Agency Admin (the test account (`HTA_USER` in .env))
- The current FAVE has at least two cost centres that are not APPROVED. Approval cannot be undone, so the test never approves the last one (kept for the repeatable FAVE tests) and skips when only one is left

## Data
- Cost centre `<cc>`: the first cost centre of the current FAVE that is not APPROVED, found when the test runs (the same one the repeatable tests use until then; they move to the next one afterwards)

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
Irreversible on UAT (tagged `final`): an approved cost centre stays APPROVED for that FAVE. Each run approves one more cost centre until only one is left. Not run on HTA yet; ask before each run. A new FAVE (next FY) or another unit for the test account (User > User Listing) makes it run again.

Automated in tests/e2e/stocktake-fave/fave-approval.spec.ts (describe 'final approval').
