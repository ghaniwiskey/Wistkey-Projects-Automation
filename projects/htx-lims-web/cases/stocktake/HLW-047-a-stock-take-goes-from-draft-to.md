---
id: HLW-047
title: "A stock take goes from Draft to Completed with handheld scan results"
feature: stocktake
priority: P0
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Stock take cycle

Verify that a stock take created on the web can be commenced, scanned on the handheld and completed, and that the results show which items were located.

## Preconditions
- Two IN items that are not in another stock take for the chosen period
- The handheld app signed in

## Data
- Title: QA ST <unique>
- Proposed dates: today to today + 7 days

## Steps
1. Log in to HTX LIMS web with the administrator account
2. Create a stock take with the two items and open it from Stock Take List > Show
3. Click Commence and confirm
4. On the handheld: Update all data, open Stocktake, select the stock take, scan only the first item and Upload anyway
5. On the web: open the stock take again and click Complete, confirm
6. Open Report > Stock Take Progress Report and Stock Take Report for the stock take number

## Expected
- After Commence the status is In Progress with a commencement date
- The handheld lists both items as Unlocated before the scan, and 1 Located / 1 Unlocated after it
- After Complete the status is Completed; the first item is Located (scanned by the user, time), the second Not located
- The progress report shows Completed, Total Item 2, Total Scanned 1
- Completing does not change the status of the not-located item (still IN)

## Notes
Executed 2026-11-18 with ST00000015 (002000017 located, 003000032 not located): pass.
