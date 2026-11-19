---
id: HLM-016
title: "Stocktake scan shows located, unlocated and extra tags and uploads only stocktake items"
feature: stocktake
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-19
updated: 2026-11-19
---

## Goal
Stocktake results

Verify that a handheld stocktake scan sorts tags into Located, Unlocated and Extra, and uploads only the stocktake's items.

## Preconditions
- An In Progress stock take with three items
- A tag that is not in the stock take (extra)

## Steps
1. On the handheld open Stocktake, select the stock take
2. Scan two of the items and one extra tag (Auto, or QA: simulate auto scan)
3. Tap Upload, review, Upload anyway
4. On the web open the stock take

## Expected
- Counters: 2 Located, 1 Unlocated, 1 Extra; located items offer Detected location
- Review says "1 Extra tag(s) are shown only and are not uploaded."
- The web shows the two items Located and the third Not located

## Notes
Executed 2026-11-19 with ST00000017 (001000010, 001000011 located, 001000017 not): pass; aborted afterwards. With a 1-item stock take the auto-scan simulation reports the item's own tag as Extra (simulation only).
