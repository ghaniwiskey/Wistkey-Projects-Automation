---
id: HLW-025
title: "Stock Level Report flags low stock"
feature: reports
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Low stock

Verify that the Stock Level Report shows Low for an item type whose stock is at or below its minimum.

## Preconditions
- An item type with a minimum stock set (Master Data > Item Type)

## Steps
1. Log in to HTX LIMS web with the administrator account
2. Open Report > Stock Level Report and click Search
3. Find an item type with Min set

## Expected
- Level is Low when Stock is at or below Min, and not Low when it is above
- Stock equals In lab + On loan for the row
- Export downloads the report with the columns shown
