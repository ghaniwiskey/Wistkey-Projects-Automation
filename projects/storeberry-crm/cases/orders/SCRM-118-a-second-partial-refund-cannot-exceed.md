---
id: SCRM-118
title: "A second partial refund cannot exceed the amount still paid on the order"
feature: orders
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Staff cannot refund more money than the customer paid.

## Preconditions
- The order from the partial refund case after product 1 was refunded

## Steps
1. Start another refund and enter an amount larger than the remaining paid amount (remaining + 0.10)
2. Enter exactly the remaining amount and confirm
3. Open Refund again

## Expected
- Step 1: refused with a message; nothing is refunded
- Step 2: accepted; order fully Refunded; total refunded = amount paid
- Step 3: Refund is no longer offered, or offers HKD 0.00 and cannot be confirmed

## Notes
Boundary companion of the partial refund case.
