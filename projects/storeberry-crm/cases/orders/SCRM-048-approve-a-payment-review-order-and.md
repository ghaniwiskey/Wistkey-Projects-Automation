---
id: SCRM-048
title: "Approve a payment-review order and verify processing status"
feature: orders
priority: P0
tags: [regression, writes, final]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
Approving a QA payment-review order advances it to the appropriate processing state.

## Preconditions
- A dedicated staging QA order is in Payment review and uses a non-routable QA contact.
- A safe staging payment-review action is available; do not use a live payment rail.

## Data
- Existing QA order selected dynamically by Payment review status.

## Steps
1. Sign in to the staging CRM.
2. Open the QA order in Payment review and confirm its order number and amount.
3. Approve the payment review.
4. Reopen the order and its status history.

## Expected
- The order leaves Payment review and shows the resulting processing/approved status.
- The order history records the approval and updated status.

## Notes
Data-changing final scenario. Staging only. Obtain explicit user approval before each run/retry. Use only QA data; never use real customer/payment details. Approval may release the order for fulfillment or notifications.
