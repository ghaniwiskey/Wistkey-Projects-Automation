---
id: SCRM-183
title: "Web POS makes the cheapest eligible item free when buying two and getting one free"
feature: pos
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-11-19
updated: 2026-11-19
---

## Goal
Verify that Web POS charges for the two higher-priced units and makes the cheapest eligible unit free only when three eligible units are in the cart.

## Preconditions
- An active buy-two-get-one-free promotion applies to the selected POS store and covers two in-stock products with different prices. Neither product has a competing item-level promotion in that store.

## Data
- Two units of the higher-priced product and one unit of the lower-priced product.

## Steps
1. Log in to Storeberry with a staff account.
2. Go to Physical Stores POS and open Web POS for the eligible store.
3. Add one unit of each eligible product and note their line prices.
4. Add one more unit of the higher-priced product.
5. Remove one unit of the higher-priced product.
6. Clear the test cart without checking out.

## Expected
- With two units, neither item is free under this promotion.
- With three units, the cheaper unit shows the promotion name and a zero line price; both higher-priced units keep their original unit price.
- Returning to two units removes the free-item discount and restores the cheaper unit price.

## Notes
Check item prices and subtotal before any separate basket discount.
