---
id: SCRM-133
title: "Choosing a refund method in the return POS does not finish the refund before CHECK OUT"
feature: orders
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Staff can check the refund amount and method before money is refunded.

## Preconditions
- A paid QA order with at least one item to return (SCRM-117)

## Data
- Refund by Bank Transfer only (the dialog also lists card and wallet methods: never pick them)

## Steps
1. Order detail > Exchange / Partial Return > Online Shop, select an item, Next, Exchange & refund
2. In "Please choose payment method for refund" click Bank Transfer
3. Look at the screen before pressing anything else

## Expected
- Step 3: the payment step shows Refund, the Bank Transfer line and CHECK OUT; nothing is completed until CHECK OUT is pressed

## Notes
Risk from explorations/2026-10-28-paid-order-changes.md: on the first return the CHECK OUT button was still needed; on the next two a "Please wait..." overlay appeared right after Bank Transfer was picked and the Complete dialog followed with no CHECK OUT. A mis-click on a card or wallet tile in the same grid could refund through that gateway. Not yet confirmed as a bug.
