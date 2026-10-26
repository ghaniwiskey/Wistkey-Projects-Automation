---
id: SCRM-003
title: "Pending payment filter shows matching CRM orders"
feature: orders
priority: P1
tags: [regression]
envs: [staging]
automated: true
created: 2026-10-23
updated: 2026-10-26
---

## Goal
A CRM user can filter the order list to orders pending payment.

## Data
- Order date range: default last 12 months

## Steps
1. Sign in to the CRM as the staging store admin.
2. Open Orders and record the count in the default date range.
3. Select Pending payment.
4. Review the filtered order count and visible status labels.

## Expected
- The order list finishes loading and shows a count for the selected date range.
- When pending-payment records exist, the filtered count is non-zero and visible order status labels match Pending payment.
- When other statuses exist, the filtered count is lower than the All orders count.

## Notes
Read-only; tests assert counts/statuses only and do not include customer or order details in the report. Counts vary over time. Automated in tests/e2e/orders/pending-payment.spec.ts (page object tests/pages/orders.page.ts).
