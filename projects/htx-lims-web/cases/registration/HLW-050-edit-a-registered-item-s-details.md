---
id: HLW-050
title: "Edit a registered item's details"
feature: registration
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-19
updated: 2026-11-19
---

## Goal
Edit on Registered items not checked in yet saves the changed details, before and after the tag is printed, without changing the item number or chip code.

## Preconditions
- A registered item without a printed tag (register one with QA data)
- A registered item with a printed tag

## Data
- New item description: QA edited <unique>
- New serial number: QA-SN-<unique>

## Steps
1. Log in to HTX LIMS web with a User account
2. Open Registration > Item Register, click Edit on the unprinted item, change the description and serial number and save
3. Click Edit on the printed item, change its description and save
4. Open Inventory > Item Information for both items

## Expected
- Both items show the new description (and serial) in the Item Register list and in Edit (Item Information lists items only once IN, BUG-017)
- The item numbers are unchanged and the printed item keeps its chip code and Tag printed time
- Audit Trail has an entry for each edit with the user and time

## Notes
Coverage review 2026-11-19: Edit is shown on every registered item (context.md) but no case covered it. Note which fields are locked after printing.
