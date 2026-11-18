---
id: HLM-009
title: "All Assets shows each item's status, category and room"
feature: assets
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
All Assets

Verify that All Assets on the handheld finds items by number and shows the same status, category and room as the web.

## Preconditions
- Items in different states (IN, OUT, DISPOSED) and categories (Asset, Chemical, Consumable)

## Steps
1. On the handheld tap All Assets and Refresh list
2. Search each item by its number
3. Compare with Inventory > Item Information on the web

## Expected
- Each item shows its number, type, chip code, status and room
- Status and category match the web (a DISPOSED item is not shown as Checked in; Asset items are not shown as Fixed asset)

## Notes
Fails 2026-11-18: 003000032 DISPOSED shown as Checked in (BUG-002); Asset items shown as Fixed asset (BUG-003).
