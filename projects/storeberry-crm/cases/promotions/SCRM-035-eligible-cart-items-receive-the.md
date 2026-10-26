---
id: SCRM-035
title: "Eligible cart items receive the promotion-code discount"
feature: promotions
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
An eligible product receives the discount defined by an active promotion code in the storefront cart.

## Preconditions
- An active code-based promotion and an eligible product are available in staging.

## Data
- Active promotion code and eligible product selected from current storefront data.

## Steps
1. Open the staging storefront in a clean, isolated test session.
2. Choose an active promotion that has a code and identify an eligible product.
3. Add the eligible product to the isolated cart and enter the promotion code.
4. Review the cart discount and remove the test item.

## Expected
- The code is accepted for the eligible item and the displayed discount matches the promotion rule.
- The cart total is recalculated.
- Removing the test item leaves the isolated cart empty and no order is created.

## Notes
Cart-state write only. Use a clean isolated staging session, remove test items, and stop before checkout submission.
