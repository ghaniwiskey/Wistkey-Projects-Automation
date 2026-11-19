---
id: HLM-014
title: "Pre Check-in refuses unknown, already checked-in and repeated tags"
feature: pre-check-in
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-11-19
updated: 2026-11-19
---

## Goal
Wrong tags in Pre Check-in

Verify that Pre Check-in only accepts tags of items waiting for it, does not add a tag twice, and lets the user delete a tag before uploading.

## Preconditions
- One item already IN and one printed item not pre checked-in yet

## Data
- Unknown code: 999999999999999999999999

## Steps
1. On the handheld open Pre Check-in
2. Enter the unknown code and tap Add tag
3. Enter the chip code of the IN item and tap Add tag
4. Enter the chip code of the printed item twice
5. Tap Delete on its card and confirm

## Expected
- Unknown and IN item: "Tag not found in the downloaded items", nothing added
- The printed item is added once; the second entry shows "Tag already scanned"
- Delete asks "Delete this tag?" and the list is empty again

## Notes
Executed 2026-11-19: pass. For an IN item a clearer message (already checked in) would help.
