---
id: HLW-029
title: "Add an item type to a category"
feature: master-data
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Item Type

Verify that an administrator can add an item type with min and max stock and pick it in Item Register.

## Data
- Item Type: QA type <unique>
- Category: Consumable
- Min. Stock: 2, Max. Stock: 10

## Steps
1. Log in to HTX LIMS web with the administrator account
2. Open Master Data > Item Type and click Add Item Type
3. Enter the data and save
4. Open Registration > Item Register and pick category Consumable

## Expected
- Item Type lists the new type with its category, min and max
- The Item type list in Item Register offers the new type for Consumable

## Notes
Clean-up: delete the QA item type.
