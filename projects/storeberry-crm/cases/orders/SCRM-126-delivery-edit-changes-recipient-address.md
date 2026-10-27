---
id: SCRM-126
title: "Delivery Edit changes recipient, address and delivery info on the same order"
feature: orders
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Staff can correct delivery details without creating a replacement order.

## Preconditions
- A QA home-delivery or pickup order (any status before Delivered)

## Steps
1. Order detail > Delivery > Edit
2. Change recipient name, contact number and address; Save
3. Reload the order and open it in eShop My Orders

## Expected
- Same order number (no "...A" replacement)
- The new values are shown in the CRM and to the customer after reload
- Totals and shipping fee unchanged unless the method changed

## Notes
Never tested (2026-10-28 review).
