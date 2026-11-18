---
id: HLW-039
title: "Reprinting a tag issues a new chip code and retires the old tag"
feature: tag-printing
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-11-18
updated: 2026-11-18
---

## Goal
Reprint

Verify that reprinting an item's tag gives it a new 24-digit chip code and that the old code is no longer recognised.

## Preconditions
- An item with a printed tag
- The printer available

## Steps
1. Log in to HTX LIMS web with a User account and note the item's chip code (Item Information details or tag history)
2. Open Registration > Asset Tag Printing > Reprint tags, select the item and reprint
3. Look the item up by the old and the new chip code

## Expected
- The item has a new chip code different from the old one
- A gantry read or lookup with the old code no longer finds the item; the new one does

## Notes
Uses the real printer; the old physical tag stops working.
