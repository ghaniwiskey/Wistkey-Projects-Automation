---
id: SCRM-087
title: "Void a completed POS sale cancels it and keeps fulfilment closed"
feature: pos
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Voiding a completed POS sale cancels the order without reopening delivery.

## Preconditions
- A completed QA POS cash sale

## Data
- QA POS order created in the same session

## Steps
1. Open the POS order, Actions > Void this order > Yes
2. Read Order Status, Payment Status and Delivery Status

## Expected
- Order Status and Payment Status Canceled
- Delivery Status changes to Pending after void (accepted behavior)

## Notes
BUG-012 closed as wont-fix on 2026-10-27; Delivery Status changing to Pending after void is accepted behavior. Payment History still shows only the +Cash line after the void (question: how is the drawer reconciled?).
