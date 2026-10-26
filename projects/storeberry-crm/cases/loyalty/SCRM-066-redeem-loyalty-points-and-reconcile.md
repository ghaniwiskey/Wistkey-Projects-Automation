---
id: SCRM-066
title: "Redeem loyalty points and reconcile balance and checkout discount"
feature: loyalty
priority: P1
tags: [regression, writes, final]
envs: [staging]
automated: false
created: 2026-10-26
updated: 2026-10-26
---

## Goal
Redeeming available QA loyalty points applies the configured value and updates the member balance once.

## Preconditions
- A dedicated staging QA member has sufficient points and a sandbox checkout method is available.

## Data
- QA member selected dynamically.
- Eligible product and point amount selected within the current redemption rules.

## Steps
1. Record the QA member points balance and redemption conversion rule.
2. Add an eligible product to an isolated cart and apply the selected points.
3. Review the checkout discount and complete only through the documented sandbox method.
4. Reopen the member balance and order history.

## Expected
- The discount matches the configured point conversion.
- The member balance decreases by the redeemed points exactly once.
- The order history links the redemption to the QA order.

## Notes
Data-changing final scenario. Staging only. Obtain explicit user approval before each run/retry. Use only QA data; never use real customer/payment details. Redemption and checkout change balances and create an order; never use live payment.
