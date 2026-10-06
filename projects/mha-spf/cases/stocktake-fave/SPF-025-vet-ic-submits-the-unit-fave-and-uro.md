---
id: SPF-025
title: "VET IC submits the unit FAVE and URO rejects it back with a reason"
feature: stocktake-fave
priority: P0
tags: [regression, writes]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
The first approval step of FAVE: VET IC submits the unit's FAVE to the URO, and the URO can reject it back (reason and remarks mandatory) so VET IC can work on it again.

## Preconditions
- The test account holds VET IC, URO and UAO (the test account (`SPF_USER` in .env))
- The test brings the chosen cost centre back to VET IC before and after (Submit shown to VET IC)

## Data
- Cost centre `<cc>`: the first cost centre in the current FAVE's table that is not APPROVED (never one reserved for SPF-027), brought back to VET IC first; asset `<asset>`: its first asset in the Details tab. Found when the test runs (fixture faveTarget); the test skips when every cost centre is approved.
- Reject reason Others, remarks `QA auto fave reject <unique>`

## Steps
1. As **Verification Team IC/2IC** open the first FAVE, pick `<cc>`, click **Submit** on the Summary tab and answer **Yes**
2. Switch the role to **Unit Resource Officer** and open the same FAVE and cost centre
3. Click **Reject** and **Submit** without a reason
4. Pick **Others** and **Submit** without remarks
5. Type the remarks, **Submit**, answer **Yes**
6. Open the FAVE again and read the approval panel and the cost centre row
7. Switch back to **Verification Team IC/2IC** and open the FAVE

## Expected
- Step 1 asks "Please confirm that you want to submit this FAVE." and shows "Stocktake FAVE has been submitted."; the Verification Team IC/2IC stage shows SUBMITTED and the Submit button is gone
- As URO the Summary shows **Submit** and **Reject**
- Step 3 shows "Reason is required"; step 4 shows "Remarks is required"
- Step 5 asks "Please confirm that you want to reject this FAVE." and shows "Stocktake FAVE has been rejected."
- The Unit Resource Officer stage shows REJECTED and "Remarks: <remarks>"; the cost centre row shows status REJECTED, role Unit Resource Officer; URO has no Submit/Reject any more
- VET IC sees the **Submit** button again

## Notes
Emails the URO on submit and VET IC (cc URO) on reject (manual). UAO Approve (final, no HQ AO on SPF) is covered by SPF-027 on another cost centre, so APD stays repeatable.

Automated in tests/e2e/stocktake-fave/fave-approval.spec.ts (FavePage approval methods; fixture returnFaveToVetIc rejects the FAVE back to VET IC before and after).
