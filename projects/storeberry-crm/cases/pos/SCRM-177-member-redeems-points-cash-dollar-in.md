---
id: SCRM-177
title: "Member redeems points (cash dollar) in Web POS and the balance is reduced once"
feature: pos
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Points redemption at the till follows the same rules as online.

## Preconditions
- A QA member with more than 100 points
- Cash drawer selected

## Data
- Cash

## Steps
1. Add the member and a product above $100
2. Redeem the maximum cash dollar and pay the rest in Cash
3. Read the member points and the order

## Expected
- Discount follows the rule (100 points = $100, max $100 per order); points drop once
- Voiding the sale returns the points
- Cleanup: void the sale

## Notes
Gap from the 2026-10-29 review, sixth pass (no existing case found by search). Never tested. Related: SBF-054 (online).
