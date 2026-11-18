---
id: HLW-013
title: "Print RFID tags for a newly registered item"
feature: tag-printing
priority: P0
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Asset Tag Printing

Verify that a registered item can be sent to tag printing and then shows a tag printed time.

## Preconditions
- A registered item without a printed tag
- A printer configured in Asset Tag Printing

## Steps
1. Log in to HTX LIMS web with a User account
2. Open Registration > Asset Tag Printing
3. Pick the printer and label size, select the new item under Print new tags
4. Click Print 1 selected

## Expected
- A success message is shown
- Item Register > Registered items not checked in yet shows a Tag printed time for the item
- Check In / Out > Printed lists the item with Tag Printed On
- The item has a 24-digit chip code (encoded RFID) and can no longer be deleted

## Notes
Printing sends a job to a real RFID printer: run only when the printer may be used.
