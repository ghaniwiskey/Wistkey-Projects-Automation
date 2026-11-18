---
id: HLW-019
title: "Stock take progress and results are reported"
feature: stocktake
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Stock take reports

Verify that a completed stock take shows its totals in the Stock Take Progress Report and each item's result in the Stock Take Report.

## Preconditions
- At least one Completed stock take

## Steps
1. Log in to HTX LIMS web with the administrator account
2. Open Stock Take > Stock Take List and note a Completed stock take's number and item count
3. Open Report > Stock Take Progress Report and search for that number
4. Open Report > Stock Take Report and search for that number

## Expected
- The progress report shows status Completed, Total Item equal to the item count, and Commenced/Completed dates and users
- The Stock Take Report lists one row per item with Result Located or Not located
