---
id: SCRM-132
title: "Partial returns never refund more than the item share, and refunds on an order never exceed the amount paid"
feature: orders
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Rounding on a return cannot pay the customer more than they paid.

## Preconditions
- A paid (receipt accepted) eShop order of a QA member with two items whose shares are not whole tenths, e.g. a HKD 600 item + a HKD 0.10 item with the member discount (total after rounding HKD 510.00), found at runtime

## Data
- Refund by Bank Transfer (original method)

## Steps
1. Order detail > Exchange / Partial Return > Online Shop: select item 1, note its share, Next, read Rounding and Total
2. Finish the refund (Exchange & refund > Bank Transfer)
3. Return item 2 the same way
4. Add up the refund orders and compare with the order's paid total

## Expected
- Step 1: refund = item 1 share, rounded toward zero (never more than the share)
- Step 3: refund <= item 2 share
- Step 4: sum of refunds <= amount paid

## Notes
2026-10-28 manual: fail, BUG-029. TXN0126102800003 (510.00 paid): C share 509.92 refunded 510.00 (Rounding -0.08), cake share 0.08 refunded 0.10: 510.10 refunded in total.
