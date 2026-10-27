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
- A visible message asks to select a cash drawer (Settings > Cash In Out), or the payment screen opens

## Notes
2026-10-27: nothing happens; only console.error "Pleas select a cash drawer in setting page first!" (BUG-014).
