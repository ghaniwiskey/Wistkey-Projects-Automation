---
id: SBF-060
title: "Promotion landing page lists the promotion's products and the discount applies in the cart"
feature: promotions
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Customers who open a promotion page get the advertised deal.

## Preconditions
- A live promotion page found at runtime from the home page (/promotion/<id>)

## Steps
1. Open the promotion page
2. Add a listed product to the cart and open checkout

## Expected
- The page shows the promotion terms and only eligible products
- The discount in the cart matches the terms
- Cleanup: empty the cart

## Notes
Feature with no cases before the 2026-10-29 feature-coverage review (menu/page found in the live staging app). Never tested.
