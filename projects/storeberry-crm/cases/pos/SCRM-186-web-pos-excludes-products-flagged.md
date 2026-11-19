---
id: SCRM-186
title: "Web POS excludes products flagged against whole-order promotions from the membership discount"
feature: pos
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-11-20
updated: 2026-11-20
---

## Goal
Verify that a membership basket discount does not discount a product excluded from whole-order promotions.

## Preconditions
- An active membership basket offer and an eligible member. One product is excluded from whole-order promotions and another is eligible.

## Data
- One excluded product and one eligible item.

## Steps
1. Log in to Storeberry with a staff account.
2. Open Web POS for a participating store.
3. Add the excluded product and select an eligible member.
4. Add the eligible item.
5. Clear the test cart.

## Expected
- The excluded product by itself stays at full price.
- After an eligible item is added, the discount applies to the eligible amount only, not the excluded product.
