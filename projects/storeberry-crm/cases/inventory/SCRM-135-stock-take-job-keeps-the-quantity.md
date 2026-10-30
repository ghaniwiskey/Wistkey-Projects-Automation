---
id: SCRM-135
title: "Stock take counting hides expected quantities (runs as Blind count)"
feature: inventory
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-30
---

## Goal
Documents the accepted behavior: counting runs as Blind count, also for a job created as Open count.

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
- Step 2: Review shows the chosen Quantity visibility (Open count)
- Step 4: the Count inventory panel shows 'Blind count is on.' and hides expected quantities

## Notes
Found in explorations/2026-10-28-payment-recovery-fix-retests.md. BUG-030, closed as wont-fix (accepted behavior): the Open count choice is not applied.
