---
id: SCRM-135
title: "Stock take job keeps the quantity visibility chosen at creation (Open count)"
feature: inventory
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Counters see expected quantities when the job was created as Open count, and not when Blind count.

## Preconditions
- A warehouse the QA staff is mapped to as a stock take user; a product variant found at runtime

## Data
- Job name QA-ST-<unique>

## Steps
1. Stock Take > Create Job: name, warehouse, assignee, Quantity visibility = Open count, Continue
2. Choose specific variants: one variant, Review Job -> note Quantity visibility
3. Create Job > OK, Start Counting > OK
4. Read the Count inventory panel
5. Cleanup: Cancel Job > OK

## Expected
- Step 2: Review shows Open count
- Step 4: the job is in Open count: current/snapshot quantities are visible; no 'Blind count is on' banner
- Repeat with Blind count: quantities hidden

## Notes
Found in explorations/2026-10-28-payment-recovery-fix-retests.md.
