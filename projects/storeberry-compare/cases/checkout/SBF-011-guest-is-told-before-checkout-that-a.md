---
id: SBF-011
title: "Guest cannot place an order containing a package (quota) product"
feature: checkout
priority: P1
tags: [regression]
envs: [staging]
automated: false
created: 2026-10-27
updated: 2026-10-27
---

## Goal
Guests cannot buy a quota (Package) product; checkout stops with a member-required message.

## Data
- A Package product (CRM Products > Package filter, e.g. 偈油x10), found at runtime

## Steps
1. As a guest add the quota product to the cart
2. Open checkout, fill in the guest details and click Proceed to checkout

## Expected
- At Proceed to checkout a modal says a member is required for quota products ("Member is requried for quota product.")
- No order is created for the guest

## Notes
"Quota product" = CRM product type Package (uses tracked per member). Regular products such as test product EN 1 are not affected. BUG-005 closed as wont-fix on 2026-10-27: the late, unnamed warning at Proceed to checkout is accepted behavior; this case checks only that the guest is blocked.
