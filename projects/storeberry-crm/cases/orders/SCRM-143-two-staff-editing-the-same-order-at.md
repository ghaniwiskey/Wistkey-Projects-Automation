---
id: SCRM-143
title: "Two staff editing the same order at once do not silently overwrite each other"
feature: orders
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Concurrent staff edits on one order are detected or merged safely.

## Preconditions
- An unpaid QA eShop order

## Data
- Two browser tabs logged in as the staff account

## Steps
1. Open the order in both tabs
2. Tab 1: change the remark and save
3. Tab 2 (not reloaded): change the delivery info and save
4. Reload the order

## Expected
- Tab 2 is warned that the order changed, or both changes are kept; nothing is lost silently
- Cleanup: void the order

## Notes
Gap from the 2026-10-29 critical-flow review, second pass (no existing case found by search). Never tested.
