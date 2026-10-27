---
id: SCRM-049
title: "Reject a payment-review order and verify rejection history"
feature: orders
priority: P0
tags: [regression, writes, final]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-27
---

## Goal
Rejecting a QA payment-review order records the rejection outcome and any supplied reason.

## Preconditions
- A dedicated staging QA order is in Payment review and uses a non-routable QA contact.

## Data
- A unique QA rejection reason.
- Existing QA order selected dynamically by status.

## Steps
1. Sign in to the staging CRM.
2. Open the QA order in Payment review.
3. Reject the payment review and enter the QA reason if the form requests one.
4. Reopen the order and review its status history.

## Expected
- The order shows Payment rejected or the corresponding rejection state.
- The status history records the rejection and the entered reason when supported.

## Notes
Data-changing. Staging only, on own QA orders (allowed without asking each time, user 2026-10-27, including customer notifications). Get the order into Payment review by placing a Bank Transfer order and uploading a receipt (guest: thank-you page > Upload Payment Prove > Choose File). Reject = order detail > Receipt tab > comment > Deny > OK. The customer sees REJECTED and the comment in Order Tracking. Verified manually 2026-10-27: TXN0126102700016.
