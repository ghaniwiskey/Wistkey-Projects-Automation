---
id: HLW-038
title: "Label size By category picks the tag type of the item's category"
feature: tag-printing
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Tag type by category

Verify that printing with label size By category uses Anti-Liquid for chemicals, Metal for assets and Paper (box tag) for other categories.

## Preconditions
- Registered unprinted items of category Chemical, Asset and Consumable
- The Zebra printer available

## Data
- Label size: By category

## Steps
1. Log in to HTX LIMS web with a User account
2. Open Registration > Asset Tag Printing, pick the printer and label size By category
3. Select one Chemical, one Asset and one Consumable item and print

## Expected
- The Label details column (or printed labels) show Anti-Liquid 46 x 40 mm for the chemical, Metal 50 x 15 mm for the asset and Paper 73 x 20 mm for the consumable
- Each item gets a 24-digit chip code

## Notes
Uses the real printer: run only when it may be used.
