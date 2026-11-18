---
id: HLW-048
title: "Stock-take adjustment disposes an item that was not located"
feature: stocktake
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Stock adjustment

Verify that after a completed stock take an administrator can set a not-located item to DISPOSED, which takes it out of stock and tracking.

## Preconditions
- A completed stock take with at least one Not located item

## Data
- New status: DISPOSED
- Reason: QA test <unique>

## Steps
1. Log in to HTX LIMS web with the administrator account
2. Open the stock take from Stock Take List > Show
3. Under Stock-take adjustment tick the not-located item, choose New status DISPOSED, enter the reason and click Adjust 1 selected

## Expected
- The message "1 tag(s) adjusted." is shown
- Item Information shows the item with status DISPOSED
- The item is no longer offered in Check Out or Chemical Usage
- Audit Trail has "Stock adjustment ... Status: IN → DISPOSED" with the reason

## Notes
Executed 2026-11-18 on 003000032: pass. Answers Q-004 (Stock Adjustment is in the Stock Take Detail).
