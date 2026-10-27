---
id: SCRM-076
title: "Deny an uploaded bank transfer receipt"
feature: orders
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Staff can reject a wrong payment receipt.

## Preconditions
- A QA order in Payment Review with an uploaded receipt

## Data
- Comment: Aside QA test - deny

## Steps
1. Order detail > Receipt tab
2. Enter the comment, click Deny > OK
3. Reload the order

## Expected
- Order Status Payment Rejected
- Payment Status Pending payment

## Notes
Verified 2026-10-27 on TXN0126102700003.
