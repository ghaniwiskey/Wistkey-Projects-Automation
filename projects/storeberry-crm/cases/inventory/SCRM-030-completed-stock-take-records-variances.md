---
id: SCRM-030
title: "Completed stock take records variances and updates inventory"
feature: inventory
priority: P0
tags: [smoke, writes, final]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-27
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
Data-changing. Staging only, on own QA jobs; stock-take completion is allowed without asking each time (user, 2026-10-27). Setup: ghani has Stock Take Staff + Admin roles (added by the user 2026-10-27) and is mapped to TaiPo and other warehouses. BUG-021 (failed on 2026-10-27) was set to verified by the user on 2026-10-28: the case is expected to pass; rerun it as the retest.
