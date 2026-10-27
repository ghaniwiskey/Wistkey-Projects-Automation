---
id: SBF-020
title: "Checkout add-on offers refresh correctly after removing a cart item"
feature: checkout
priority: P2
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
After a cart item is removed, the promotion add-on section only offers products of promotions the cart still qualifies for, at their correct price.

## Preconditions
- Logged-in member; active add-on promotions 650 (reach $100) and 620 (reach $1000, 水晶手串1 at $0)

## Data
- Product C (HKD 600) and product test 2 (HKD 1,000), found at runtime

## Steps
1. Add C and product test 2 to the cart and open /checkout
2. Remove product test 2 with the row remove icon
3. Read the add-on section without reloading

## Expected
- The "promotion" add-on lists its own Group B products (9吋公仔 A/B, 巨寶 A/B, Shoes C at HKD 100)
- No product from a promotion the cart no longer qualifies for is offered

## Notes
Cart-state only; clear the cart afterwards. Currently fails: BUG-013 (2026-10-27).
