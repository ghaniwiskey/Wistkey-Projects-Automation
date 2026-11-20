---
id: SCRM-188
title: "Web POS enforces the advertised cutoff for an above-threshold promo code"
feature: pos
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-11-20
updated: 2026-11-20
---

## Goal
Verify that an offer advertised as above HKD 50 does not discount a basket that is at or below HKD 50.

## Preconditions
- An active 20% promo code advertised for spending above HKD 50 applies to the selected store. Eligible products are available.

## Data
- Use eligible items with no competing discount, or turn off unrelated basket offers for the cart.

## Steps
1. Log in to Storeberry with a staff account.
2. Open Web POS for a participating store.
3. Add eligible items totaling HKD 49 and apply the code.
4. Remove the code and replace the basket with HKD 50 of eligible items.
5. Enter and apply the code again.
6. Clear the test cart without checking out.

## Expected
- The code does not discount the HKD 49 basket.
- The code does not discount the HKD 50 basket under the advertised wording.
