---
id: SBF-011
title: "Guest is told before checkout that a package (quota) product needs login"
feature: checkout
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Guests learn early that a quota product needs a member account.

## Data
- A Package product (CRM Products > Package filter, e.g. 偈油x10), found at runtime

## Steps
1. As a guest add the quota product to the cart
2. Open checkout

## Expected
- A message naming the product says login is required before the guest fills the form
- No order is created for the guest

## Notes
"Quota product" = CRM product type Package (uses tracked per member). Regular products such as test product EN 1 are not affected. Today the warning only appears after Proceed to checkout ("Member is requried for quota product.").
