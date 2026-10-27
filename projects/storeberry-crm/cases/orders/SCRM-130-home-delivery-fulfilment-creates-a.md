---
id: SCRM-130
title: "Home delivery fulfilment creates a waybill / tracking number the customer can see"
feature: orders
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Courier-delivered orders get a tracking number end to end.

## Preconditions
- A paid QA home-delivery order using a courier method (ShipAny / SF)

## Steps
1. CRM Delivery: pack and dispatch with the courier, create the waybill
2. Open the order Delivery history and eShop My Orders / Order Tracking

## Expected
- A waybill / tracking number is stored on the order
- The customer sees the tracking number and status

## Notes
Idea from explorations/2026-10-27-fulfilment-stock.md. May be blocked by BUG-016 (check-shipping 500) and by courier sandbox availability; mark blocked rather than failed in that case.
