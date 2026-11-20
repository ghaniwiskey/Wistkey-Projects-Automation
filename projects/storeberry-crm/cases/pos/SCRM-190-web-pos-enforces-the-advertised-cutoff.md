---
id: SCRM-190
title: "Web POS enforces the advertised cutoff for a fixed-amount minimum-spend code"
feature: pos
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-11-20
updated: 2026-11-20
---

## Goal
Verify that neither a below-cutoff basket nor one exactly at the cutoff receives an offer described as over the cutoff.

## Preconditions
- An active fixed-amount minimum-spend code applies to this store. Turn off unrelated discounts in the test cart.

## Data
- Example: Gifted deducts HKD 23 over HKD 200. Use eligible products.

## Steps
1. Open a participating store in Web POS.
2. Apply the code to an eligible basket below the cutoff.
3. Remove the code and bring the eligible subtotal to exactly the cutoff.
4. Apply the code again.
5. Clear the test cart without checkout.

## Expected
- No discount applies below the cutoff.
- No discount applies at the exact cutoff under the advertised wording.

## Notes
Q-025 tracks the cutoff and the Applied label despite no deduction.
