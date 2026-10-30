---
id: SCRM-009
title: "Order status tabs show only matching orders"
feature: orders
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-30
---

## Goal
Each order status view limits the list to the selected status.

## Preconditions
- Dedicated Storeberry Flower staging admin account is configured in local .env.

## Steps
1. Sign in to the staging CRM and open Orders.
2. Review All orders, then select Pending payment, Payment review, Payment rejected, Processing, Complete, Canceled, Refunded and Refund order one at a time.
3. Select Exchanged and open the Details of one listed order.

## Expected
- For each selected status, every visible row has that status label (Processing and Complete also list their "(Exchange Order)" rows).
- Exchanged is a flag, not a status: its rows keep their own status (e.g. Processing, Complete) and the opened order shows "Exchanged: n".
- The All orders view can contain multiple statuses, and an empty status view shows no rows.
- Counts are taken from the current page and are not hard-coded.

## Notes
Read-only. Do not use Actions, status controls, or customer/order details.
