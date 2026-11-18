---
id: HLW-018
title: "Create a stock take for a storage location"
feature: stocktake
priority: P0
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Create Stock Take

Verify that an administrator can create a stock take with selected items and it appears as Draft in the Stock Take List.

## Preconditions
- Items with status IN in at least one storage location

## Data
- Title: QA ST <unique>
- Proposed dates: today to today + 7 days

## Steps
1. Log in to HTX LIMS web with the administrator account
2. Open Stock Take > Create Stock Take, pick a Storage Location and click Search
3. Select the listed items and click Move to Selected
4. Enter Title and the proposed start and end dates and click Submit
5. Open Stock Take > Stock Take List

## Expected
- The new stock take is listed with a Stock Take No, the title, the dates, the item count of the selected items and Status Draft
- Show lists the selected items

## Notes
Draft stock takes are downloaded to the handheld app; delete or abort the QA stock take afterwards if possible.
