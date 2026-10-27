---
id: SCRM-029
title: "Approved replenishment request creates a linked transfer"
feature: inventory
priority: P0
tags: [smoke, writes, final]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-27
---

## Goal
Approving a replenishment request creates a traceable transfer order for the requested stock.

## Preconditions
- Two active warehouses and a product eligible for replenishment are available in staging.

## Data
- Request identifier: QA-<unique>.
- Product, warehouses, and a small controlled quantity selected dynamically.

## Steps
1. Sign in to the staging CRM and open Inventory > Replenishment Request.
2. Create a unique replenishment request for a suitable product, source warehouse, destination warehouse, and small quantity.
3. Approve the request.
4. Open the request and its linked transfer order.

## Expected
- The request changes to Approved.
- A linked transfer order number is shown and its source, destination, product, and quantity match the request.

## Notes
Data-changing. Staging only, on own QA requests; replenish approve is allowed without asking each time (user, 2026-10-27). "Approve and Create Transfer Order" opens a prefilled Add Transfer Order form; the request becomes Approved only after Submit > Confirm there. Verified manually 2026-10-27: QA-RR-mvqi08o1 -> Transfer26102709445029e9. Detail times are UTC (BUG-006).
