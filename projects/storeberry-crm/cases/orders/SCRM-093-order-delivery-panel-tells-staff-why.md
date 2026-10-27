---
id: SCRM-093
title: "Order delivery panel tells staff why Dispatch or Save is refused"
feature: orders
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Invalid packing actions give feedback instead of silently doing nothing.

## Preconditions
- A QA order in Processing with nothing packed

## Data
- Order found at runtime

## Steps
1. Open the order Delivery panel and click Dispatch with nothing packed
2. Pack All, change the parcel qty to more than ordered (e.g. 5 of 1) and click Save

## Expected
- Dispatch with nothing packed shows a message (e.g. pack items first)
- Save with packed qty above ordered qty shows a message or caps the qty

## Notes
Currently fails: BUG-018 (2026-10-27).
