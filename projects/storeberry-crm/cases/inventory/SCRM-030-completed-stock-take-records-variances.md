---
id: SCRM-030
title: "Completed stock take records variances and updates inventory"
feature: inventory
priority: P0
tags: [smoke, writes, final]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
Completing a stock take records counted variances and updates the affected inventory.

## Preconditions
- A staging warehouse and product variant with a known current quantity are available.

## Data
- Job name: QA-<unique>.
- A controlled staff count for one selected product variant.

## Steps
1. Sign in to the staging CRM and record the current quantity of a suitable test product at a staging warehouse.
2. Create a uniquely named stock take job for that warehouse and product variant.
3. Enter a controlled staff count, submit the job, review its variance, and complete the job.
4. Reopen Inventory and Inventory History for the product.

## Expected
- The job progresses through the applicable In Progress, Submitted, Reviewed, and Completed states.
- The initial variance equals staff count minus the snapshot quantity.
- The completed count is reflected in inventory and a corresponding movement appears in Inventory History.

## Notes
Data-changing and final. Staging only. Obtain explicit approval before each run; completing stock take can permanently adjust inventory.
