---
id: SCRM-028
title: "Transfer receipt moves stock between warehouses"
feature: inventory
priority: P0
tags: [smoke, writes, final]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
A transfer order records a controlled movement of stock from a source warehouse to a destination warehouse.

## Preconditions
- Two active staging warehouses and a product with sufficient source stock are available.

## Data
- Transfer number: QA-<unique>.
- Product, source, destination, and a small controlled quantity selected dynamically.

## Steps
1. Sign in to the staging CRM and record the available quantity of a suitable product at two active warehouses.
2. Create a uniquely identified transfer order for a small quantity from the source warehouse to the destination warehouse.
3. Move the order through dispatch/in-transit and receive the transferred quantity at the destination.
4. Review the transfer record and both warehouse inventory views.

## Expected
- The transfer progresses through the applicable Pending, In-transit, and Received states.
- The received quantity is reflected at the destination and the source/destination stock totals reconcile to the transfer.
- The transfer number and receive time are visible in the record.

## Notes
Data-changing and final. Staging only. Obtain explicit approval before each run; stock movement and audit history are persistent.
