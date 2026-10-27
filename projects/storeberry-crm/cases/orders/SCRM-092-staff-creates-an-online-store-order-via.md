---
id: SCRM-092
title: "Staff creates an online store order via Add Order (WebPOS) with store pickup"
feature: orders
priority: P0
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Staff can create an online order for a member from Orders > Add Order > Add Online Store Order via WebPOS.

## Preconditions
- A QA member exists
- An in-stock product at the online warehouse

## Data
- Member and product found at runtime

## Steps
1. Orders > Add Order > Add Online Store Order via WebPOS (opens a POS tab)
2. Select the QA member and add one product
3. Shipping: choose 門市自取, enter an address, pick a pickup store, Submit
4. Click Total and pay by Bank Transfer

## Expected
- Shipping is accepted and shown on the cart
- A new online order is created in Pending payment with the chosen pickup store
- Total equals subtotal minus member discount plus shipping fee

## Notes
Payment: Bank Transfer only. Shipping is mandatory: Total says "Please input and confirm Shipping information first."
Currently fails: BUG-016 (check-shipping returns 500, 2026-10-27).
