---
id: SCRM-069
title: "Complete sandbox storefront checkout and verify order confirmation"
feature: storefront
priority: P0
tags: [smoke, writes, final]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
A shopper can complete a staging purchase using only a documented sandbox payment method.

## Preconditions
- A staging storefront and documented sandbox payment method are available.
- Notification routing is confirmed safe for QA contact details.

## Data
- Available storefront product selected dynamically.
- Test-only contact details and designated sandbox payment method.

## Steps
1. Open the staging storefront in an isolated session.
2. Add an available product to the cart and proceed through checkout.
3. Enter QA-only contact and delivery details and select the documented sandbox payment method.
4. Submit the order and open its confirmation.

## Expected
- The storefront displays an order confirmation with a new order reference.
- The order appears in staging with the expected item, total, and initial payment/order status.
- No live payment is attempted and no real person receives a message.

## Notes
Data-changing final scenario. Staging only. Obtain explicit user approval before each run/retry. Use only QA data; never use real customer/payment details. Requires a documented sandbox payment method and safe notification routing; never use real payment credentials.
