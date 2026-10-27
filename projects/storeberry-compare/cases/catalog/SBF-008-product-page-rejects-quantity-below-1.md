---
id: SBF-008
title: "Product page rejects quantity below 1 and sold-out variants"
feature: catalog
priority: P2
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Customers cannot add zero/negative quantities or sold-out variants.

## Data
- A product with at least one SOLD OUT variant, found at runtime

## Steps
1. Open a product page
2. Set quantity 0 and click Add To Cart
3. Set quantity -3 and click Add To Cart
4. Pick a variant marked SOLD OUT

## Expected
- "Quantity must be greater than or equal to 1" is shown and the cart badge is unchanged for 0 and -3
- For a sold-out variant the button reads SOLD OUT and nothing is added
