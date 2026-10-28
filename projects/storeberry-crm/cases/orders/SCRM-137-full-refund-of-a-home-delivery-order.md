---
id: SCRM-137
title: "Full refund of a home-delivery order also handles the shipping fee"
feature: orders
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
A refunded home-delivery order returns the full amount the customer paid, including the shipping fee, or the rule is stated.

## Preconditions
- A paid QA home-delivery eShop order with a non-zero shipping fee (SBF-029 with a basket below the free-shipping threshold, receipt accepted with SCRM-075)

## Data
- Bank Transfer (fn-bank-transfer)

## Steps
1. Note the order total, the shipping fee and the member points
2. Order detail > Actions > Refund this order
3. Read the refund amount, Payment History, points and the Payment report for the day

## Expected
- The refund amount equals the paid total including the shipping fee (or the screen states that shipping is not refunded)
- Points earned by the order are reversed; stock returns to the warehouse
- The Payment report shows the refund as a negative amount

## Notes
Gap from the 2026-10-29 critical-flow review (no existing case found by search). Never tested. Related: SCRM-051 (generic refund), SCRM-112.
