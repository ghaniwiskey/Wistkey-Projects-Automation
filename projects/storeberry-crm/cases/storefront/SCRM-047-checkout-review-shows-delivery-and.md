---
id: SCRM-047
title: "Checkout review shows delivery and payment choices without submitting"
feature: storefront
priority: P0
tags: [smoke, writes]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
A shopper can review checkout delivery and payment information without placing an order.

## Preconditions
- A staging storefront product and an isolated test checkout session are available.

## Data
- Test-only contact details; never use a real customer identity or payment card.

## Steps
1. Open the staging storefront in a clean, isolated test session.
2. Add an available product to the cart and proceed to checkout.
3. Use test-only contact details and review delivery and payment choices.
4. Stop before the final order submission or payment action.

## Expected
- Checkout displays the selected cart items, totals, and available delivery and payment choices.
- Required checkout fields and any validation are visible.
- No order is created, no message is sent, and no payment is attempted.

## Notes
Checkout/session write only. Staging only. Stop before final submission; never place a payment or create a live order under this scenario.
