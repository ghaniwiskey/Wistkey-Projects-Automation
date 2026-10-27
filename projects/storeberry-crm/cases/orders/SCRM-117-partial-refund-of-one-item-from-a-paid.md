---
id: SCRM-117
title: "Partial refund of one item from a paid multi-item order refunds its share of the discounts, points and stock"
feature: orders
priority: P0
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Refunding part of an order gives back the right money and takes back the right points and stock.

## Preconditions
- A paid (receipt accepted) eShop order of a QA member with two different products and a basket discount (member level and/or promo code)
- Points rule from Loyalty Setting > Point Policy

## Data
- Refund to Original Payment Method (Bank Transfer); no card/wallet

## Steps
1. Note the order lines, discounts, total, member points and each product's Available in Inventory
2. Order detail > Actions > Refund (or Partial Return) and refund only product 1
3. Reread the order, the member Point History and Inventory

## Expected
- Step 2: the suggested refund amount = product 1's share of the paid total after basket discounts (state the formula seen) and can be confirmed
- Step 3: order shows Partially Refunded (or equivalent) with the refunded line; Payment History lists the refund amount
- Step 3: points taken back = points earned on the refunded amount only; product 1 Available +1, product 2 unchanged

## Notes
Gap: only full refunds were tested (SCRM-051, SCRM-112). Exchange / Partial Return opens the POS in an iframe (README); BUG-017 (exchange takes back more points) was closed as wont-fix, so do not re-report that exact point rule.
