---
id: SCRM-050
title: "Cancel an eligible unpaid order and verify its history"
feature: orders
priority: P1
tags: [regression, writes, final]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
Canceling an eligible QA order records a canceled state and audit entry.

## Preconditions
- A dedicated staging QA order is unpaid and eligible for cancellation.

## Data
- QA order selected dynamically; never select a real customer order.

## Steps
1. Sign in to the staging CRM.
2. Open the eligible QA order and verify it is unpaid.
3. Cancel the QA order using the available cancellation flow.
4. Reopen its detail and status history.

## Expected
- The order shows Canceled.
- The order history records the cancellation and time.

## Notes
Data-changing final scenario. Staging only. Obtain explicit user approval before each run/retry. Use only QA data; never use real customer/payment details. Do not cancel any non-QA order.
