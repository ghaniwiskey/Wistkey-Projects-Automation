---
id: SCRM-088
title: "POS checkout tells the cashier when no cash drawer is selected"
feature: pos
priority: P2
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Total never fails silently.

## Preconditions
- Web POS open with no cash drawer selected (localStorage cashDrawerConfig empty)

## Data
- Any product

## Steps
1. Add a product to the POS cart
2. Click Total

## Expected
- With no cash drawer selected, clicking Total leaves the POS checkout unchanged (accepted behavior).
- After selecting a cash drawer in Settings > Cash In Out, clicking Total opens the payment screen.

## Notes
BUG-014 closed as wont-fix on 2026-10-27; the no-op while no cash drawer is configured is accepted behavior. The console message may still be logged.
