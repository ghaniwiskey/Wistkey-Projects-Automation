---
id: SBF-055
title: "A free-gift promotion whose gift is out of stock is handled clearly at checkout"
feature: checkout
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Customers are not promised or charged for a gift that cannot be shipped.

## Preconditions
- Free gift promotion found at runtime (e.g. promotion 631 at net $800)
- Gift product Available 0 in TaiPo (ask first if the gift is not our QA product)

## Data
- Basket above the threshold

## Steps
1. Reach the threshold and open checkout
2. Proceed to checkout

## Expected
- The gift is shown as unavailable (or not offered) with a message; the order does not fail with "Not enough stock" for a free item
- Cleanup: void the order and restore stock

## Notes
Gap from the 2026-10-29 critical-flow review, third pass (no existing case found by search). Never tested. Related: SCRM-036.
