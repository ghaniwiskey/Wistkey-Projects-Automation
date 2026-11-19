---
id: HLM-020
title: "The handheld Check-out card shows the item type name"
feature: check-out
priority: P3
tags: [regression]
envs: [all]
automated: false
created: 2026-11-19
updated: 2026-11-19
---

## Goal
Check-out item cards show the item type name (as Pre Check-in and Check-in do), not a number.

## Preconditions
- An item type added in Master Data > Item Type today, with one item IN (QA data)
- The handheld signed in

## Steps
1. On the handheld tap Update all data
2. Open Check-out, enter the item number and tap Find item
3. Look at the item card, then Add to list

## Expected
- The card shows "Type: <type name> · Consumable" (as in Pre Check-in and Check-in), not a number

## Notes
Found 2026-11-19: 002000026 of new type "QA high 373230" showed "102 · Consumable · Checked in" in Check-out, while Pre Check-in and Check-in showed "Type: QA high 373230".
