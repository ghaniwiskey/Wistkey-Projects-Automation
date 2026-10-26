---
id: SCRM-027
title: "Receiving a purchase order updates warehouse stock"
feature: inventory
priority: P0
tags: [smoke, writes, final]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
Receiving a purchase order increases the selected warehouse stock by the accepted quantity.

## Preconditions
- A staging warehouse, supplier, and product with sufficient stock capacity are available.

## Data
- PO/Lot number: QA-<unique>.
- Product and quantity selected from staging data; use a small controlled quantity.

## Steps
1. Sign in to the staging CRM and record the available quantity of a suitable test product at a staging warehouse.
2. Create a uniquely numbered purchase order for that product, an existing supplier, and a small controlled quantity.
3. Receive the full quantity on the purchase order.
4. Reopen Inventory and Inventory History for the product.

## Expected
- The purchase order reaches Received status and displays a receive time.
- Available quantity at the selected warehouse increases by the received quantity.
- Inventory History contains the receipt linked to the PO/Lot number.

## Notes
Data-changing and final. Staging only. Obtain explicit approval before each run; receiving stock changes inventory and history permanently.
