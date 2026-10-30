---
id: SBF-069
title: "An order containing two variants preserves each SKU, price and stock reservation"
feature: checkout
priority: P1
tags: [regression, writes, final]
envs: [staging]
automated: false
created: 2026-10-30
updated: 2026-10-30
---

## Goal
Two variants of one product in the same order

Verify that buying two variants preserves their separate quantities, prices, SKUs and warehouse reservations.

## Preconditions
- A QA member has an empty cart.
- A stock-tracked, non-quota product has two active variants with different SKUs and prices, with at least 1 unit of variant A and 2 units of variant B available in the checkout warehouse.

## Data
- Variant A and B names, SKUs, prices and starting available quantities read from the selected product and inventory.
- Bank Transfer and store pickup only.
- Order remark: Variant mapping <unique>.

## Steps
1. Log in to the eShop as the QA member and note the selected variants, their prices and the warehouse’s available quantities.
2. Add 1 unit of variant A and 2 units of variant B to the cart.
3. Review the two cart lines, complete pickup details and place the Bank Transfer order with the unique remark.
4. Open the confirmation and member order details, then log in to the CRM and open that same order and inventory.
5. Void the test order and confirm that both variant reservations are released.

## Expected
- The cart and accepted order retain separate lines for variant A quantity 1 and variant B quantity 2, with the selected option names and prices.
- The CRM order maps each line to the matching SKU; neither variant replaces or merges into the other.
- Available quantity decreases by 1 for variant A and by 2 for variant B, with no reservation against an unrelated variant.
- Voiding the order releases exactly those quantities back to the same variants and warehouse.

## Notes
Proposed gap, not executed. SCRM-017 checks saved product options, SCRM-022 reads inventory by variant and SBF-008 checks sold-out variants. Those cases do not verify two variants of one parent product flowing through the same accepted order. Find suitable variants at runtime; do not hard-code catalog records. Explicit run approval required for order placement and void cleanup.
