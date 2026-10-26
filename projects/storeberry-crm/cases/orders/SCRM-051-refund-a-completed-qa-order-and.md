---
id: SCRM-051
title: "Refund a completed QA order and reconcile the refund amount"
feature: orders
priority: P0
tags: [regression, writes, final]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
A refund on a completed QA order records the selected amount and refund state consistently.

## Preconditions
- A dedicated staging QA order is completed and paid only through a documented sandbox payment method.
- A sandbox refund operation is available.

## Data
- QA order selected dynamically.
- Refund amount bounded by the QA order total.

## Steps
1. Sign in to the staging CRM.
2. Open the completed QA order and record its total.
3. Issue a refund for the full eligible amount using the sandbox flow.
4. Reopen the order and payment/refund history.

## Expected
- The order displays the corresponding refunded/refund state.
- The refund history shows the submitted amount and links to the QA order.
- No live payment rail is used.

## Notes
Data-changing final scenario. Staging only. Obtain explicit user approval before each run/retry. Use only QA data; never use real customer/payment details. Money movement is prohibited unless the staging payment rail is confirmed as a sandbox.
