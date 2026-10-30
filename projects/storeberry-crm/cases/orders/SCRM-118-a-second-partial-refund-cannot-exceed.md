---
id: SCRM-118
title: "A second partial return refunds the remaining paid amount"
feature: orders
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-30
---

## Goal
After one item was returned, returning the remaining item refunds what is still paid.

## Preconditions
- The order from the partial refund case after product 1 was refunded

## Steps
1. Order detail > Exchange / Partial Return: select the remaining item, Next, Exchange & refund > the original method
2. Add up the refund orders and compare with the order paid total

## Expected
- Step 1: the refund equals the remaining paid amount (item share)
- Step 2: total refunded = amount paid; the order is fully refunded

## Notes
After a partial return, Actions no longer offers Refund this order; further refunds go through Exchange / Partial Return. BUG-032, closed as wont-fix (accepted behavior): its Refund pencil (Adjust final price) accepts any amount, even above what was paid, so do not edit the amount. Boundary companion of the partial refund case.
