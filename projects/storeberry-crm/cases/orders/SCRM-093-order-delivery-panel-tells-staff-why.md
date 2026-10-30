---
id: SCRM-093
title: "Order delivery panel ignores Dispatch with nothing packed and Save above the ordered qty"
feature: orders
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-30
---

## Goal
Documents the accepted behavior of invalid packing actions: they change nothing.

## Preconditions
- A QA order in Processing with nothing packed

## Data
- Order found at runtime

## Steps
1. Open the order Delivery panel and click Dispatch with nothing packed
2. Pack All, change the parcel qty to more than ordered (e.g. 5 of 1) and click Save

## Expected
- Step 1: nothing happens, no message; the order stays Processing and nothing is dispatched
- Step 2: nothing is saved; after reload the packed qty is not above the ordered qty

## Notes
BUG-018, closed as wont-fix (accepted behavior): both actions are silently ignored (no request, no message).
