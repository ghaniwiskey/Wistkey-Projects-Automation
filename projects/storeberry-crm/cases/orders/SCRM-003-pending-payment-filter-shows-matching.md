---
id: SCRM-003
title: "Pending payment filter shows matching CRM orders"
feature: orders
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-23
updated: 2026-10-23
---

## Goal
A CRM user can filter the order list to orders pending payment.

## Data
- Order date range: default last 12 months

## Steps
1. Log in to the CRM.
2. Open Orders.
3. Select Pending payment.
4. Review the order count and visible order statuses.

## Expected
- The order list finishes loading and shows a non-zero count when pending orders exist in the selected date range.
- Each displayed order has the Pending payment status.
- The total count is lower than the unfiltered All orders count when other statuses are present.

## Notes
Read-only. On staging the initial all-orders list showed 1,017 orders; Pending payment showed 204 on 2026-10-23.
