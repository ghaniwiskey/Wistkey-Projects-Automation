---
id: SCRM-175
title: "Bulk \"Make product terminated in all platforms\" asks for confirmation before terminating"
feature: products
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Staff cannot terminate products by a single misclick.

## Preconditions
- A product list row selected (do not confirm on products we did not create)

## Steps
1. Select one QA product row
2. Actions > Make product terminated in all platforms

## Expected
- A confirmation naming the number of products is shown; Cancel leaves them active

## Notes
Gap from the 2026-10-29 review, sixth pass (no existing case found by search). Never tested. Linked bug: BUG-003 (open). Running the action without a dialog terminates at once: use only our own QA product and get approval (terminate is irreversible, @final).
