---
id: SCRM-108
title: "A revoked promotion code is refused on the eShop, also when it was applied before it was revoked"
feature: promotions
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Revoking a leaked code stops it immediately, including in carts where it is already applied.

## Preconditions
- Staging CRM login; a QA promotion "Promo Code: Get Y% off with discount code X", Applied Shop Online Shop, Multiple Promotion Code (created during the test, e.g. 662), one Generated code
- QA member logged in on the eShop with a product in the cart

## Data
- Bank Transfer only

## Steps
1. Apply the code at /checkout -> Expect: Applied
2. In the CRM click Revoke on that code
3. On the eShop fill pickup info and Proceed to checkout
4. Reload /checkout and apply the same code again

## Expected
- Step 2: status Revoked, Revoke/Assign buttons gone
- Step 3: no order is created (order list unchanged); a warning says the code is invalid
- Step 4: "Promotion code is invalid, expired or exceed the usage limit" and no discount

## Notes
2026-10-28 manual: pass (QAka7BxS, QBgH2nw9). Revoke has no confirmation and cannot be undone. The checkout keeps showing the revoked code until reload: storeberry-compare BUG-018 / SBF-026.
