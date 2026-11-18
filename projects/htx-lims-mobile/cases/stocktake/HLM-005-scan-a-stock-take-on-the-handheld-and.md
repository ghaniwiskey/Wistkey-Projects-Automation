---
id: HLM-005
title: "Scan a stock take on the handheld and upload the results"
feature: stocktake
priority: P0
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Handheld stock take

Verify that an In Progress stock take can be selected and scanned on the handheld and its results uploaded.

## Preconditions
- A stock take commenced on the web (In Progress)

## Steps
1. On the handheld tap Update all data, then Stocktake > Select stocktake, choose the stock take and tap OK
2. Scan the items (Auto or the trigger; QA: simulate located scan on a device without a reader)
3. Tap Upload, review and confirm (Upload anyway when items are missing)

## Expected
- Before scanning all items are Unlocated with their current location
- Scanned items turn Located and the counters update
- Missing items prompt "Some items were not located" with Upload anyway / Cancel
- "Stocktake uploaded"; the web stock take shows the scanned items as Located

## Notes
Executed 2026-11-18 with ST00000015: pass.
