---
id: SCRM-179
title: "Web POS receipt and reprint show the right items, discounts, payment and change"
feature: pos
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Customers get a correct receipt.

## Preconditions
- Cash drawer selected

## Data
- Member sale with a promo code, Cash with change

## Steps
1. Complete the sale and print/preview the receipt
2. Reprint it from the order

## Expected
- Items, quantities, discounts, total, cash given and change match the order; reprint is marked as a copy

## Notes
Gap from the 2026-10-29 review, sixth pass (no existing case found by search). Never tested.
