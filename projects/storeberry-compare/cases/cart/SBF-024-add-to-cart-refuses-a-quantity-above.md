---
id: SBF-024
title: "Add To Cart refuses a quantity above online stock, including what is already in the cart"
feature: cart
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
The eShop never lets a customer put more units in the cart than are available online.

## Preconditions
- product test 2 has a small known online stock N (sum of the Online Shop warehouses in CRM Inventory; 52 on 2026-10-27)

## Data
- N read from CRM Inventory > View by Variants (Office + TaiPo + IFC Warehouse + 半島倉)

## Steps
1. As a guest with an empty cart open product test 2
2. Set quantity N+1 and click Add To Cart
3. Set quantity 9 and click Add To Cart
4. Set quantity N-8 and click Add To Cart

## Expected
- Step 2: "Not enough quantity for this product"; cart badge unchanged (0)
- Step 3: "Item added successfully"; badge 9
- Step 4: "Not enough quantity for this product"; badge stays 9
- Cleanup: empty the cart

## Notes
2026-10-27 manual: pass (52 accepted, 53 refused; 9 in cart + 60 refused). The checkout uses a different limit: BUG-017 (wont-fix, accepted) / SBF-025.
