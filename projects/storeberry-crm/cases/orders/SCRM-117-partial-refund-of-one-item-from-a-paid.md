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
1. Note the order lines, discounts, total, member points, level spending and each product's Available in Inventory
2. Order detail > Exchange / Partial Return > Online Shop (POS in `iframe.webpos-iframe`): raise product 1's return qty, Next, cancel the Shipping popup, Exchange & refund, Bank Transfer (Actions > Refund this order is full-refund only)
3. Reread the original order, the linked refund order, the member Point History, level spending and Inventory

## Expected
- Step 2: the item share = line price x paid total / subtotal (e.g. 600 of 1,600 on a 1,300 total = 487.50) and the refund equals it
- Step 3: the original order line shows "Exchanged: 1" and a Status History "Exchange" row; a linked refund order ("This is an exchange order. Original order: ...") holds the returned line and the negative Bank Transfer payment
- Step 3: points: the member keeps floor(10% x kept amount); level spending goes down by the refund once; product 1 Available +1, product 2 unchanged

## Notes
2026-10-28 manual: fail, BUG-028 (level spending deducted twice). Share, refund amount, points (-49 on 487.50) and stock were right (TXN0126102800001 -> refund TXN0126102800002). See also SCRM-132 (rounding), SCRM-134 (level downgrade).

Gap: only full refunds were tested (SCRM-051, SCRM-112). Exchange / Partial Return opens the POS in an iframe (README); BUG-017 (exchange takes back more points) was closed as wont-fix, so do not re-report that exact point rule.
