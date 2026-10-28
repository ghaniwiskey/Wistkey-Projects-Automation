---
id: SCRM-167
title: "Loyalty Product redemption is refused when the member lacks points or the product is out of stock"
feature: loyalty
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Members cannot get a points product they cannot pay for or that is not in stock.

## Preconditions
- A QA loyalty product (SCRM-155) with a points price
- A QA member with fewer points than the price

## Steps
1. Try to redeem as the member
2. Give the member enough points (SCRM-081), set the product stock to 0, try again

## Expected
- Both attempts are refused with a clear message; points and stock unchanged
- Cleanup: restore stock and points

## Notes
Critical flow inside a feature first covered on 2026-10-29 (feature-coverage review follow-up). Never tested.
