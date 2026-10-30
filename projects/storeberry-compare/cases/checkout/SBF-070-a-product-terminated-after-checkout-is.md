---
id: SBF-070
title: "A product terminated after checkout is prepared cannot be ordered from the stale page"
feature: checkout
priority: P1
tags: [regression, writes, final]
envs: [staging]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Product terminated while a shopper is at checkout

Verify that final checkout refuses a product that staff have terminated on all platforms after it was added to the cart.

## Preconditions
- A QA member and a staff account with product termination permission are available.
- A disposable QA-created regular physical product is available online and has stock.

## Data
- Bank Transfer and store pickup only.
- Use only the disposable product created for this test, not a shared catalog product.

## Steps
1. Log in to the eShop as the QA member, add the disposable product and prepare its checkout without submitting.
2. In a separate session, log in to the CRM as staff and terminate only that product on all platforms. Verify it appears in Terminated Products.
3. Return to the already-prepared checkout and click Proceed without reloading first.
4. Inspect the member order list, CRM orders and inventory for the disposable product.
5. Remove the terminated product from the cart.

## Expected
- Checkout does not create an accepted order for the terminated product.
- The shopper is informed that the product is unavailable or is required to review a cart with that product removed.
- No new stock reservation is created for the failed submission.

## Notes
Proposed gap, not executed. SCRM-002 and SCRM-175 verify catalog termination, not an already-open checkout. This case deliberately uses Terminated on all platforms, not Hidden Product: hidden products are documented as still purchasable. Termination may be irreversible and the product cannot be assumed restorable. Obtain explicit approval for that particular disposable product and run; retain its terminated history and remove only the cart entry afterward.
