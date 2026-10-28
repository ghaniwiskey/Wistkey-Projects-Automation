---
id: SBF-043
title: "Member buys a package (quota) product and its remaining uses are tracked"
feature: checkout
priority: P1
tags: [regression, writes]
envs: [staging]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Package products sold online give the member the right number of uses and each use is deducted once.

## Preconditions
- Logged-in QA member
- A package/quota product found at runtime (CRM Products > Package view, e.g. 偈油x10)

## Data
- Bank Transfer (fn-bank-transfer)

## Steps
1. Buy 1 package as the member and pay (receipt accepted in the CRM, SCRM-075)
2. Open the member's package/quota balance on the eShop and in the CRM
3. Redeem one use in Web POS with the member and recheck the balance

## Expected
- Step 2: the balance equals the package size (e.g. 10)
- Step 3: the balance drops by exactly 1 and the redemption is in the history
- Cleanup: refund the package order; the remaining quota is removed

## Notes
Gap from the 2026-10-29 critical-flow review, second pass (no existing case found by search). Never tested. SBF-011 only covers guests being refused. Related: Q-001.
