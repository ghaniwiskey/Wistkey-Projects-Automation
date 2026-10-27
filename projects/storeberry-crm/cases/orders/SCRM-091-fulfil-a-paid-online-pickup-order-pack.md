---
id: SCRM-091
title: "Fulfil a paid online pickup order: pack, dispatch and complete"
feature: orders
priority: P0
tags: [smoke, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
A paid eShop order can be packed and dispatched in the CRM and ends Complete, with stock deducted once.

## Preconditions
- A QA member eShop order paid by Bank Transfer and accepted (status Processing, payment Complete)

## Data
- Order found at runtime in Orders > Processing, created by the QA member

## Steps
1. Open the order detail and click Delivery
2. Click Pack All, then Save
3. Click Dispatch and confirm OK
4. Reload the order and open Status History
5. Open Inventory History for the product

## Expected
- Save shows "update successfully"
- Order Status, Payment Status and Delivery Status are Complete; Delivered equals ordered qty; Completed Date set
- Status History lists processing then complete
- Inventory History shows one DELIVERED -1 Stock Qty entry for the order at the order warehouse

## Notes
Explored 2026-10-27 on TXN0126102700004 (pickup). Points are awarded at payment acceptance, not at completion (see SCRM-065).
