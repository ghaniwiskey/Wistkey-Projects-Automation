---
id: SCRM-089
title: "Refund is not offered on an unpaid order"
feature: orders
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Money cannot be refunded on an order that was never paid, and the UI never accepts an action that it then ignores.

## Preconditions
- A QA online order in Pending Payment (Bank Transfer, no receipt)

## Data
- QA order created in the same session

## Steps
1. Open the order detail > Actions
2. If Refund this order is listed: Original Payment Method > Refund > Yes

## Expected
- Refund this order is offered for the pending-payment QA order.
- Confirming the zero-payment refund leaves the order in Pending Payment without creating a refund, and shows no additional message (accepted behavior).

## Notes
BUG-013 closed as wont-fix on 2026-10-27; offering the refund action and making no change to an unpaid order is accepted behavior.
