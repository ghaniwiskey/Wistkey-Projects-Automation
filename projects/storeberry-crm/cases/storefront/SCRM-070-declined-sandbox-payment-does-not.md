---
id: SCRM-070
title: "Declined sandbox payment does not create a paid order"
feature: storefront
priority: P0
tags: [regression, writes, final]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
A designated sandbox decline response does not leave the QA order in a paid state.

## Preconditions
- A staging checkout supports a documented payment-decline test method.
- Notification routing is confirmed safe for QA contact details.

## Data
- Available product selected dynamically.
- Test-only contact details and the designated sandbox decline method.

## Steps
1. Open the staging storefront in an isolated session.
2. Add an available product and proceed to checkout with QA-only contact details.
3. Use only the documented sandbox decline method.
4. Review the displayed result and inspect the resulting QA order/payment status if an order record is created.

## Expected
- Checkout displays a payment-failure state.
- No resulting order is marked paid or completed and no successful payment is recorded.
- No live payment is attempted.

## Notes
Data-changing final scenario. Staging only. Obtain explicit user approval before each run/retry. Use only QA data; never use real customer/payment details. If no documented sandbox decline method exists, mark blocked; never simulate with a real card.
