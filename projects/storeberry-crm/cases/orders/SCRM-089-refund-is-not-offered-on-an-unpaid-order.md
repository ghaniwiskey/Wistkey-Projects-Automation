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
- Refund this order is not listed (or disabled) for unpaid orders
- If an action is refused, a message explains why

## Notes
2026-10-27 (TXN0126102700006): Refund is offered with "Refund amount $0.10"; confirming reloads the page with no change and no message, twice (BUG-013).
