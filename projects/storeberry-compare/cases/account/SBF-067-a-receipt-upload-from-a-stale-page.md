---
id: SBF-067
title: "A receipt upload from a stale page cannot reopen a canceled order"
feature: account
priority: P0
tags: [regression, writes, final]
envs: [staging]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Receipt upload after order cancellation

Verify that submitting a receipt from a page opened before cancellation cannot reactivate a canceled order or restore its stock reservation.

## Preconditions
- A QA member and a staff account with permission to void the member’s test order are available.
- A stock-tracked non-quota product has enough available quantity for one test order.
- A clearly marked test receipt image is available.

## Data
- Bank Transfer and store pickup only.
- Order remark: Stale receipt <unique>.

## Steps
1. Log in to the eShop as the QA member and place a Bank Transfer order with the unique remark.
2. Open the new order’s Upload Receipt page and leave it open without submitting.
3. In a separate session, log in to the CRM as staff and void only this test order. Note the canceled status, available stock and member points after cancellation.
4. Return to the already-open Upload Receipt page, select the marked test receipt and submit it without reloading first.
5. Reload the member order, the CRM order, inventory and point history. Compare them with the values recorded after cancellation.

## Expected
- The order remains Canceled in both member and staff views after the stale receipt submission.
- The submission does not move the order to Payment Review, Processing or Complete and does not record an approved payment.
- The receipt submission does not recreate a stock reservation or change member points from the post-cancellation values.

## Notes
Proposed coverage gap, not executed. SBF-065 checks that Upload Receipt disappears after cancellation; this case checks a previously opened form at submission time. SBF-031 covers re-upload after rejection, not cancellation. Whether the file itself is rejected or retained as history is not asserted; the canceled state and released reservation must remain intact. Explicit approval is needed for order placement, cancellation and the stale upload in each run.
